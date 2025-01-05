import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import invariant from 'tiny-invariant';
import dotenv from 'dotenv';
import axios, { isAxiosError } from 'axios';

// Load environment variables from .env file
dotenv.config();
const app = express();
invariant(process.env.NEST_API_URL, 'No Base Url found');
const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? null
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );
const allowedUrls = [
  process.env.NEST_API_URL,
  process.env.REMIX_APP_URL,
  'https://fresh-turtle-electric.ngrok-free.app',
];

app.use(
  viteDevServer ? viteDevServer.middlewares : express.static('build/client')
);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedUrls.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable cookies if required
};
app.use(cors(corsOptions));
// Use cookie-parser middleware
app.use(cookieParser());


// redis
import { createClient } from 'redis';

export const client = createClient({
  username: 'default',
  password: 'nPPIMlMh7RsIbYADQgPTh4jkkxM9ioHE',
  socket: {
    host: 'redis-18677.c311.eu-central-1-1.ec2.redns.redis-cloud.com',
    port: 18677,
  },
});

// client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  try {
    await client.connect();
    console.log('Connected to Redis');
    await client.set('foo', 'bar');

    const result = await client.get('foo');
    console.log(result); // >>> bar
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();




const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
  : await import('./build/server/index.js');

// and your app is "just a request handler"
app.all('*', createRequestHandler({ build }));

app.listen(3000, () => {
  console.log('App listening on http://localhost:3000');
});
