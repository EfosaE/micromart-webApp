import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import './index.css'
import { createBrowserRouter } from 'react-router';
import routes from './routes';



let router = createBrowserRouter(routes, {
  // need to ensure this script runs AFTER <StaticRouterProvider> in
  // entry.server.tsx so that window.__staticRouterHydrationData is available
  hydrationData: window.__staticRouterHydrationData,
});

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// type stuff
declare global {
  interface Window {
    __staticRouterHydrationData: any;
  }
}
