import { Links, Meta, Outlet, Scripts, useLocation } from '@remix-run/react';

import 'react-toastify/dist/ReactToastify.css'; // Don't forget to import the CSS
import type { LinksFunction } from '@remix-run/node';
import stylesheet from '~/tailwind.css?url';
import Footer from '~/components/Footer';
import Navbar from '~/components/Navbar';
import { SnackbarProvider } from 'notistack';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    href: 'https://fonts.googleapis.com/css2?family=Klee+One&family=Libre+Franklin:ital,wght@0,100..900;1,100..900&family=Space+Grotesk&display=swap',
    rel: 'stylesheet',
  },
];

// export function ErrorBoundary() {
//   const error = useRouteError();
//   console.error(error);
//   return (
//     <html>
//       <head>
//         <title>Oh no!</title>
//         <link rel='icon' href='data:image/x-icon;base64,AA' />
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         {
//           error instanceof Error && (
//             <div>
//               <h1>Error</h1>
//               <p>{error.message}</p>
//               <p>The stack trace is:</p>
//               <pre>{error.stack}</pre>
//             </div>
//           ) /* add the UI you want your users to see */
//         }
//         <Scripts />
//       </body>
//     </html>
//   );
// }

export default function App() {
  const location = useLocation();

  // Check if the current route is one of the authentication routes
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <html>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='data:image/x-icon;base64,AA' />
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          {!isAuthPage && <Navbar />}
          <SnackbarProvider
            maxSnack={3} // Number of toasts visible at a time
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}>
            <Outlet />
          </SnackbarProvider>
          {!isAuthPage && <Footer />}
        </main>

        <Scripts />
      </body>
    </html>
  );
}

// export function ErrorBoundary() {
//   const error = useRouteError();

//   if (isRouteErrorResponse(error)) {
//     return (
//       <div>
//         <h1>
//           {error.status} {error.statusText}
//         </h1>
//         <p>{error.data}</p>
//       </div>
//     );
//   } else if (error instanceof Error) {
//     return (

//     );
//   } else {
//     return <h1>Unknown Error</h1>;
//   }
// }
