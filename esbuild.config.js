import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['./server.js'],
    outfile: './dist/server.js',
    bundle: true,
    platform: 'node',
    target: 'node20', // Adjust based on your Node.js version
    external: ['vite', 'express'], // Avoid bundling these dependencies
    format: 'esm', // Use ESM format
  })
  .then(() => {
    console.log('Server build complete');
  })
  .catch(() => process.exit(1));
