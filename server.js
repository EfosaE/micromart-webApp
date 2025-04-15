import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import invariant from 'tiny-invariant';
import dotenv from 'dotenv';



// Load environment variables from .env file
dotenv.config();
const app = express();
invariant(process.env.NEST_API_URL, 'No Base Url found');
// invariant(process.env.REDIS_URL, 'No Redis Url found');
// invariant(process.env.REDIS_PASSWORD, 'checl your env file for passwords');
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


const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
  : await import('./build/server/index.js');

// and your app is "just a request handler"
app.all('*', createRequestHandler({ build }));

app.listen(3000, () => {
  console.log('App listening on http://localhost:3000');
});
