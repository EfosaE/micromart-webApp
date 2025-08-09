// // redis
// import { createClient, RedisClientType } from "redis";

// let client: RedisClientType | null = null;

// export async function initializeRedis() {
//   if (!client) {
//     client = createClient({
//       username: "default",
//       password: process.env.REDIS_PASSWORD,
//       socket: {
//         host: process.env.REDIS_URL,
//         port: Number(process.env.REDIS_PORT),
//       },
//     });
//     client.on("error", (err) => console.log("Redis Client Error", err));
//     client.on("connect", () => console.log("Redis Connected Successfully"));
//     await client.connect();
//   }

//   return client;
// }

// redis.ts
import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function initializeRedis(timeoutMs = 3000) {
  if (client) return client;

  client = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_URL,
      port: Number(process.env.REDIS_PORT),
      reconnectStrategy: false, // disable infinite retry
    },
  });

  client.on("error", (err) => {
    console.error("Redis Client Error:", err.message);
  });

  client.on("connect", () => {
    console.log("Redis Connected Successfully");
  });

  try {
    // Promise.race to enforce timeout
    await Promise.race([
      client.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Redis connection timeout")), timeoutMs)
      ),
    ]);
    return client;
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    client = null; // reset so we can retry later
    return null;
  }
}
