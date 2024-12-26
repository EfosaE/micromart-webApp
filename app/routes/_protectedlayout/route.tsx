import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { createUserSession, getUser } from '~/services/session.server';
import { isUser, User } from '~/types';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log('protected loader called');
  const currentUrl = new URL(request.url); // Get the current URL
  const redirectTo = currentUrl.pathname + currentUrl.search; // Preserve the path and query parameters

  const response = await getUser(request);
  console.log('getuserProtected', response);
  if (!response) {
    const encodedRedirectTo = encodeURIComponent(redirectTo);

    // Redirect to login with the encoded redirectTo query parameter
    return redirect(`/login?redirectTo=${encodedRedirectTo}`);
  }
  if ('token' in response) {
    const { user, token } = response;
    // Create session with user and token
    return createUserSession({
      request,
      redirectTo,
      token,
      user,
    });
  }
  if (isUser(response)) {
    return new Response(JSON.stringify({ user: response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

type LoaderData = {
  user?: User;
  error?: string;
};

const GlobalLayout = () => {
  const { user, error } = useLoaderData<LoaderData>();

  return (
    <main className='container'>
      <div>
        {user ? (
          <p>
            Welcome, <span className='text-tertiary'>{user.name}!</span>
          </p>
        ) : (
          <p className='text-red-500'>{error || 'Unable to load profile.'}</p>
        )}
      </div>
      <Outlet />
    </main>
  );
};

export default GlobalLayout;
