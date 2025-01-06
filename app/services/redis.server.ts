// redis
import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export async function initializeRedis() {
  if (!client) {
    client = createClient({
      username: 'default',
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_URL,
        port: Number(process.env.REDIS_PORT),
      },
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.on('connect', () => console.log('Redis Connected Successfully'));
    await client.connect();
  }

  return client;
}
