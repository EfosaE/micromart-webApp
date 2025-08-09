// // redis.ts
// import { createClient, RedisClientType } from "redis";

// let client: RedisClientType | null = null;

// export async function initializeRedis(timeoutMs = 3000) {
//   if (client) return client;

//   client = createClient({
//     username: "default",
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//       host: process.env.REDIS_URL,
//       port: Number(process.env.REDIS_PORT),
//       reconnectStrategy: false, // disable infinite retry
//     },
//   });

//   client.on("error", (err) => {
//     console.error("Redis Client Error:", err.message);
//   });

//   client.on("connect", () => {
//     console.log("Redis Connected Successfully");
//   });

//   try {
//     // Promise.race to enforce timeout
//     await Promise.race([
//       client.connect(),
//       new Promise((_, reject) =>
//         setTimeout(() => reject(new Error("Redis connection timeout")), timeoutMs)
//       ),
//     ]);
//     return client;
//   } catch (err) {
//     console.error("Failed to connect to Redis:", err);
//     client = null; // reset so we can retry later
//     return null;
//   }
// }


// redis.ts
import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;
let connectionAttempted = false;
let isConnecting = false;

export async function initializeRedis(timeoutMs = 3000): Promise<RedisClientType | null> {
  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (!isConnecting) {
          resolve(client);
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  }

  if (client) return client;
  
  // If we already tried and failed, don't retry in the same process
  if (connectionAttempted && !client) {
    return null;
  }

  isConnecting = true;
  connectionAttempted = true;

  try {
    client = createClient({
      username: "default",
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_URL,
        port: Number(process.env.REDIS_PORT),
        reconnectStrategy: false, // disable infinite retry
        connectTimeout: timeoutMs,
      },
    });

    // Set up error handlers before connecting
    const errorHandler = (err: Error) => {
      console.error("Redis Client Error:", err.message);
      // Don't let Redis errors crash the app
    };

    const connectHandler = () => {
      console.log("Redis Connected Successfully");
    };

    client.on("error", errorHandler);
    client.on("connect", connectHandler);

    // Promise.race to enforce timeout
    await Promise.race([
      client.connect(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Redis connection timeout")), timeoutMs)
      ),
    ]);

    isConnecting = false;
    return client;
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    
    // Clean up the failed client
    if (client) {
      try {
        // Remove event listeners to prevent memory leaks
        client.removeAllListeners();
        // Don't await this, just try to disconnect
        client.disconnect().catch(() => {});
      } catch (cleanupError) {
        console.error("Error cleaning up Redis client:", cleanupError);
      }
    }
    
    client = null;
    isConnecting = false;
    return null;
  }
}

export async function getRedisClient(): Promise<RedisClientType | null> {
  if (!process.env.REDIS_URL || !process.env.REDIS_PASSWORD) {
    console.warn("Redis credentials not provided, skipping Redis connection");
    return null;
  }

  try {
    return await initializeRedis();
  } catch (error) {
    console.error("Error getting Redis client:", error);
    return null;
  }
}

// Utility function to safely execute Redis operations
export async function safeRedisOperation<T>(
  operation: (client: RedisClientType) => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const redisClient = await getRedisClient();
    if (!redisClient) {
      return fallback;
    }

    return await operation(redisClient);
  } catch (error) {
    console.error("Redis operation failed:", error);
    return fallback;
  }
}

// Graceful shutdown function
export async function closeRedis(): Promise<void> {
  if (client) {
    try {
      await client.disconnect();
      client = null;
      connectionAttempted = false;
    } catch (error) {
      console.error("Error closing Redis connection:", error);
    }
  }
}