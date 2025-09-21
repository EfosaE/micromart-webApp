import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";


export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(), // Enable path aliases as per tsconfig.json
  ],
});
//  ignoredRouteFiles: ['**/*'], // Ensures Remix's default routing is ignored
//       routes(defineRoutes) {
//         return flatRoutes('flatroutes', defineRoutes); // Use flatRoutes for dynamic routing
//       },

// {
//       presets: [vercelPreset()],
//       future: {
//         v3_fetcherPersist: true,
//         v3_relativeSplatPath: true,
//         v3_throwAbortReason: true,
//         v3_singleFetch: true,
//         v3_routeConfig: true,
//         v3_lazyRouteDiscovery: true,
//       },
//     }