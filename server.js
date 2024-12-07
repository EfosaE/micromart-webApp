import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

// Emulate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
const base = process.env.BASE || '/';

// Dynamically set the root directory based on the environment
const rootDir = path.resolve(__dirname);
const distClientDir = path.resolve(rootDir, './client'); // Path to client files
const distServerDir = path.resolve(rootDir, './server'); // Path to server files
const indexHtmlPath = path.resolve(distClientDir, './index.html'); // Path to index.html

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile(indexHtmlPath, 'utf-8')
  : '';

// Create HTTP server
const app = express();

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(base, sirv(distClientDir, { extensions: [] }));
}

// Serve HTML with SSR
app.use(async (req, res) => {
  // for the templating HTML
  const url = req.originalUrl.replace(baseUrl, '');

  console.log('path:', url);

  // for the context request
  const requestUrl = new URL(req.url, baseUrl); // Combine base and relative path
  console.log('ABS-PATH:', requestUrl);
  const abortController = new AbortController();
  const signal = abortController.signal;

  // HTML BUILDING
  let template;
  let handler;
  if (!isProduction) {
    // Read and transform the template dynamically in development
    const devTemplatePath = path.resolve(rootDir, './index.html');
    template = await fs.readFile(devTemplatePath, 'utf-8');
    template = await vite.transformIndexHtml(url, template);
    handler = (await vite.ssrLoadModule('./src/entry-server.tsx')).handler;
  } else {
    // Use precompiled template in production
    template = templateHtml;
    handler = (await import(path.resolve(distServerDir, './entry-server.js')))
      .handler;
  }

  try {
    // Express.Request isnt the same as Web Fetch API
    const adaptedRequest = new Request(requestUrl, {
      method: req.method,
      headers: req.headers,
      body:
        req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body,
      signal,
      redirect: 'follow', // Optional, default is "follow"
      credentials: 'same-origin', // Optional
      cache: 'default', // Optional
      referrer: req.headers.referer || 'about:client', // Optional
      integrity: '', // Optional, if applicable
    });

    const response = await handler(adaptedRequest);

    // If the SSR handler returns a Response object, send it
    if (response instanceof Response) {
      // Extract the plain rendered HTML from the handler
      const body = await response.text();

      // Replace placeholders in the template with rendered content
      const finalHtml = template.replace(`<!--app-html-->`, body);
      res
        .status(response.status)
        .set(Object.fromEntries(response.headers))
        .send(finalHtml);
      return;
    }

    res.status(500).send('SSR Handler did not return a valid response.');
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Start HTTP server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
