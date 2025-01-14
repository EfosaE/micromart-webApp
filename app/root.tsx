import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  useLoaderData,
  useLocation,
  useMatches,
  useRouteError,
} from '@remix-run/react';
import { SpeedInsights } from '@vercel/speed-insights/remix';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import stylesheet from '~/tailwind.css?url';
import Footer from '~/components/Footer';
import { SnackbarProvider } from 'notistack';
import Header from './components/Header';
import { Product, User } from './types';
import Breadcrumbs from './components/Breadcrumbs';
import { Button } from './components/Button';
import { getUser } from './services/api/user.api';
import Navbar from './components/Navbar';
import { SidebarProvider } from './hooks/SideBarContext';
import { getCartInfo } from './services/session.server';

export let handle = {
  breadcrumb: () => 'Home',
};

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
  const currentUrl = new URL(request.url);
  const redirectTo = currentUrl.pathname + currentUrl.search; // Preserve the path and query parameters
  const user = await getUser(request);
  const cart = await getCartInfo(request);

  // console.log('root loader ran', user, cart);
  if (user) {
    return { user, cart };
  }

  return { user: null, cart };
};

type LoaderData = {
  user: User | null;
  cart: Product[] | null;
};
export default function App() {
  const { user, cart } = useLoaderData<LoaderData>();
  const location = useLocation();

  // Check if the current route includes one of the authentication routes
  const isExemptPage = [
    '/login',
    '/register',
    '/account/create-product',
    '/search',
  ].some((route) => location.pathname.includes(route));

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
      <body className='bg-gray-100'>
        {!isExemptPage && <Header />}
        {!isExemptPage && (
          <SidebarProvider>
            <Navbar user={user} cart={cart} />
          </SidebarProvider>
        )}

        {!isExemptPage && <Breadcrumbs />}
        <SnackbarProvider
          maxSnack={3} // Number of toasts visible at a time
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
          <Outlet />
        </SnackbarProvider>
        {!isExemptPage && <Footer />}
        <SpeedInsights />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  let errorMessage = 'An unexpected error occurred. Please try again later.';
  let statusCode = 500;
 


  // Check if the error is a response error
  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    if (statusCode === 504) {
      errorMessage =
        'The server took too long to respond. Please reload the page.';
    } else {
      errorMessage = error.statusText || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message.split('\n')[0];
    // Handle other types of network errors
    // Customize message for 504 Gateway Timeout
    if (
      error?.message?.includes('Gateway Timeout') ||
      error.message.includes('Unable to decode turbo-stream response')
    ) {
      errorMessage = 'The server is warming up. Please reload the page.';
      statusCode = 504;
    }
    if (error.message.includes('Network request failed')) {
      errorMessage =
        'The server took too long to respond. Please reload the page.';
    }
  }

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className='flex flex-col gap-6 justify-center items-center h-screen w-full'>
          <h1 className='text-red-600'>Error {statusCode}</h1>
          <p className='text-red-700'>{errorMessage}</p>
          <Button
            onClick={() => window.location.reload()}
            label={'Reload Page'}
            styles={['w-fit']}
          />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
