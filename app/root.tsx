import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  useLocation,
  useRouteError,
} from '@remix-run/react';
import { SpeedInsights } from '@vercel/speed-insights/remix';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import stylesheet from '~/tailwind.css?url';
import Footer from '~/components/Footer';
import { SnackbarProvider } from 'notistack';
import Header from './components/Header';
import { CartItem, User } from './types';
import Breadcrumbs from './components/Breadcrumbs';
import { Button } from './components/Button';
import { getUser } from './services/api/user.api';
import Navbar from './components/Navbar';
import { SidebarProvider } from './hooks/SideBarContext';
import { getCartInfo } from './services/session.server';

export let handle = { breadcrumb: () => 'Home' };

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    href: 'https://fonts.googleapis.com/css2?family=Klee+One&family=Libre+Franklin:ital,wght@0,100..900;1,100..900&family=Space+Grotesk&display=swap',
    rel: 'stylesheet',
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const currentUrl = new URL(request.url);
    const redirectTo = currentUrl.pathname + currentUrl.search;
    const user = await getUser(request);
    const cart = await getCartInfo(request);

    return { user: user || null, cart };
  } catch (err) {
    console.error('Root loader error:', err);
    throw new Response('Failed to load application data', { status: 500 });
  }
};

type LoaderData = { user: User | null; cart: CartItem[] | null };

export default function App() {
  const { user, cart } = useLoaderData<LoaderData>();
  const location = useLocation();

  const isExemptPage = [
    '/login',
    '/register',
    '/account/create-product',
    '/search',
  ].some((route) => location.pathname.includes(route));

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="/micromart.png" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100">
        {!isExemptPage && <Header />}
        {!isExemptPage && (
          <SidebarProvider>
            <Navbar user={user} cart={cart} />
          </SidebarProvider>
        )}
        {!isExemptPage && <Breadcrumbs />}
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Outlet />
        </SnackbarProvider>
        {!isExemptPage && <Footer />}
        <SpeedInsights />
        <Scripts />
      </body>
    </html>
  );
}

// export function ErrorBoundary() {
//   const error = useRouteError();
//   console.error(error);

//   let errorMessage = 'An unexpected error occurred. Please try again later.';
//   let statusCode = 500;

//   if (isRouteErrorResponse(error)) {
//     statusCode = error.status;
//     errorMessage = error.statusText || errorMessage;
//     if (statusCode === 504) {
//       errorMessage = 'The server took too long to respond. Please reload the page.';
//     }
//   } else if (error instanceof Error) {
//     errorMessage = error.message.split('\n')[0];
//     if (
//       error.message.includes('Gateway Timeout') ||
//       error.message.includes('Unable to decode turbo-stream response')
//     ) {
//       errorMessage = 'The server is warming up. Please reload the page.';
//       statusCode = 504;
//     }
//     if (error.message.includes('Network request failed')) {
//       errorMessage = 'The server took too long to respond. Please reload the page.';
//     }
//   }

//   return (
//     <html>
//       <head>
//         <title>Error {statusCode}</title>
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         <div className="flex flex-col gap-6 justify-center items-center h-screen w-full">
//           <h1 className="text-red-600">Error {statusCode}</h1>
//           <p className="text-red-700">{errorMessage}</p>
//           <Button onClick={() => window.location.reload()} label="Reload Page" styles={['w-fit']} />
//         </div>
//         <Scripts />
//       </body>
//     </html>
//   );
// }


// root.tsx - Enhanced ErrorBoundary
export function ErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();
  
  console.error('🚨 ErrorBoundary caught error:', {
    error,
    location: location?.pathname,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
  });

  let errorMessage = 'An unexpected error occurred. Please try again later.';
  let statusCode = 500;
  let isRetryable = true;
  let debugInfo = '';

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    errorMessage = error.statusText || errorMessage;
    debugInfo = `Status: ${error.status}, Data: ${JSON.stringify(error.data)}`;
    
    if (statusCode === 504 || statusCode === 408) {
      errorMessage = 'The server took too long to respond. Please reload the page.';
      isRetryable = true;
    } else if (statusCode === 503) {
      errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
      isRetryable = true;
    } else if (statusCode >= 400 && statusCode < 500) {
      isRetryable = false; // Client errors usually aren't helped by retrying
    }
  } else if (error instanceof Error) {
    const originalMessage = error.message.split('\n')[0];
    debugInfo = `Error: ${originalMessage}, Stack: ${error.stack?.substring(0, 200)}`;
    
    // Categorize common error types
    if (
      error.message.includes('Gateway Timeout') ||
      error.message.includes('Unable to decode turbo-stream response') ||
      error.message.includes('timeout')
    ) {
      errorMessage = 'The server is warming up. Please reload the page.';
      statusCode = 504;
      isRetryable = true;
    } else if (
      error.message.includes('Network request failed') ||
      error.message.includes('fetch')
    ) {
      errorMessage = 'Network connection issue. Please check your connection and reload.';
      isRetryable = true;
    } else if (
      error.message.includes('Redis') ||
      error.message.includes('database') ||
      error.message.includes('connection')
    ) {
      errorMessage = 'Database connection issue. Please reload the page.';
      isRetryable = true;
    } else if (error.message.includes('ChunkLoadError')) {
      errorMessage = 'App update detected. Please reload the page.';
      isRetryable = true;
    } else {
      errorMessage = originalMessage;
    }
  }

  // Log detailed error info for debugging
  console.error('📊 Error details:', {
    statusCode,
    errorMessage,
    isRetryable,
    debugInfo,
    location: location?.pathname,
  });

  return (
    <html>
      <head>
        <title>Error {statusCode} - MicroMart</title>
        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{
          __html: `
            body { font-family: system-ui, sans-serif; margin: 0; padding: 0; }
            .error-container { 
              display: flex; 
              flex-direction: column; 
              gap: 1.5rem; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              padding: 2rem;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }
            .error-card {
              background: white;
              padding: 2rem;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 500px;
              width: 100%;
            }
            .error-code { 
              font-size: 3rem; 
              font-weight: bold; 
              color: #dc2626; 
              margin-bottom: 0.5rem;
            }
            .error-message { 
              color: #374151; 
              font-size: 1.1rem;
              margin-bottom: 1.5rem;
              line-height: 1.6;
            }
            .retry-button {
              background: #8b5cf6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s;
              margin-right: 12px;
            }
            .retry-button:hover { background: #7c3aed; }
            .home-button {
              background: #6b7280;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s;
              text-decoration: none;
              display: inline-block;
            }
            .home-button:hover { background: #4b5563; }
            .debug-info {
              margin-top: 2rem;
              padding: 1rem;
              background: #f3f4f6;
              border-radius: 6px;
              font-family: monospace;
              font-size: 0.8rem;
              color: #6b7280;
              text-align: left;
              display: ${process.env.NODE_ENV === 'development' ? 'block' : 'none'};
            }
          `
        }} />
      </head>
      <body>
        <div className="error-container">
          <div className="error-card">
            <div className="error-code">Error {statusCode}</div>
            <p className="error-message">{errorMessage}</p>
            <div>
              {isRetryable && (
                <button 
                  className="retry-button"
                  onClick={() => window.location.reload()}
                >
                  🔄 Reload Page
                </button>
              )}
              <a href="/" className="home-button">
                🏠 Go Home
              </a>
            </div>
            {debugInfo && (
              <div className="debug-info">
                <strong>Debug Info:</strong><br />
                {debugInfo}
              </div>
            )}
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}