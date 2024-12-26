import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  useLocation,
} from '@remix-run/react';

import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import stylesheet from '~/tailwind.css?url';
import Footer from '~/components/Footer';
import Navbar from '~/components/Navbar';
import { SnackbarProvider } from 'notistack';
import Header from './components/Header';
import { getUser } from './services/session.server';
import { isUser } from './types';

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  // Define public routes
  const publicRoutes = ['/login', '/signup', '/'];
  if (publicRoutes.includes(url.pathname)) {
    console.log(`Public route: ${url.pathname}`);
    return null;
  }

  console.log('Running root loader for protected route');
  const user = await getUser(request);
  if (!user) {
    console.log('No user found, redirecting to login');
    return redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`);
  }

  return new Response(JSON.stringify({ user }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};


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
        <link rel='icon' type='image/x-icon' href='/micromart.png' />
        {/* //sizes='64x64' */}

        <Meta />
        <Links />
      </head>
      <body className='font-space'>
        {!isAuthPage && <Header />}
        <SnackbarProvider
          maxSnack={3} // Number of toasts visible at a time
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
          <Outlet />
        </SnackbarProvider>
        {!isAuthPage && <Footer />}

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
