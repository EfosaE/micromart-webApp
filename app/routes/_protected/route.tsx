import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { createUserSession, getUser } from '~/services/session.server';
import { isUser, isUserWithAccessToken, User } from '~/types';


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUrl = new URL(request.url); // Get the current URL
  const redirectTo = currentUrl.pathname + currentUrl.search; // Preserve the path and query parameters

  const response = await getUser(request);
  console.log('getuserProtected', response);
  if (!response) {
    const encodedRedirectTo = encodeURIComponent(redirectTo);

    // Redirect to login with the encoded redirectTo query parameter
    throw redirect(`/login?redirectTo=${encodedRedirectTo}`);
  }
  if (isUserWithAccessToken(response)) {
    // Create session with user and token
    return createUserSession({
      request,
      redirectTo,
      token: response.accessToken,
      user: response.user,
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
      <Outlet />
    </main>
  );
};

export default GlobalLayout;
