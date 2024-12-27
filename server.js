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

// // Custom middleware to get and log all cookies
// const getCookiesMiddleware = (req, res, next) => {
//   console.log('Cookies from middleware:', req.cookies);

//   // You can access specific cookies using req.cookies.<cookie_name>
//   // For example:
//   // const userSession = req.cookies.userSession;

//   next(); // Pass control to the next middleware or route handler
// };
// app.use(getCookiesMiddleware);

// express endpoint for remix to understand(call it in your remix app)
app.get('/api/refresh', async (req, res) => {

});

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
  : await import('./build/server/index.js');

// and your app is "just a request handler"
app.all('*', createRequestHandler({ build }));

app.listen(3000, () => {
  console.log('App listening on http://localhost:3000');
});
