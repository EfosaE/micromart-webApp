import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Emulate __dirname
const __filename = fileURLToPath(import.meta.url); // Full path of the current file
const __dirname = path.dirname(__filename); // Directory of the current file

async function copyServerFile() {
  const source = path.resolve(__dirname, 'server.js');
  const destination = path.resolve(__dirname, 'dist', 'server.js');

  try {
    await fs.copyFile(source, destination);
    console.log('server.js copied to dist folder.');
  } catch (err) {
    console.error('Error copying server.js:', err);
  }
}

copyServerFile();
