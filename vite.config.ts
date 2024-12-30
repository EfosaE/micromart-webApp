import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import { vercelPreset } from '@vercel/remix/vite';
import tsconfigPaths from 'vite-tsconfig-paths';


export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
     
    }),
    tsconfigPaths(), // Enable path aliases as per tsconfig.json
  ],
});
//  ignoredRouteFiles: ['**/*'], // Ensures Remix's default routing is ignored
//       routes(defineRoutes) {
//         return flatRoutes('flatroutes', defineRoutes); // Use flatRoutes for dynamic routing
//       },