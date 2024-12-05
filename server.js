import fs from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

// Emulate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';


// Dynamically set the root directory based on the environment
const rootDir = path.resolve(__dirname) 
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

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    /** @type {string} */
    let template;
    /** @type {import('./src/entry-server.tsx').render} */
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      const devIndexHtmlPath = path.resolve(rootDir, './index.html');
      template = await fs.readFile(devIndexHtmlPath, 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
    } else {
      template = templateHtml;
      render = (await import(path.resolve(distServerDir, './entry-server.js')))
        .render;
    }

    const rendered = render(url);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start HTTP server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
