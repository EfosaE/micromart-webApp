import { createCookie, LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { getNewToken } from '~/services/api/auth.api';
import {
  createUserSession,
  getUserDataFromSession,
  logout,
} from '~/services/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUrl = new URL(request.url); // Get the current URL
  const redirectTo = currentUrl.pathname + currentUrl.search; // Preserve the path and query parameters
  console.log('redirectUrl', redirectTo);

  const result = await getUserDataFromSession(request);

  if (result) {
    switch (result.status) {
      case 200:
        return new Response(JSON.stringify({ user: result.user }), {
          status: result.status,
          headers: { 'Content-Type': 'application/json' },
        });

      case 403:
        const cookiesHeader = request.headers.get('cookie');
        // Get the refresh token cookie from the request
        const refreshTokenCookie = createCookie('refresh_token');
        // Parse the refresh token cookie to get the actual value
        const refresh_token = await refreshTokenCookie.parse(cookiesHeader);

        // If we have a refresh token, try to get a new token
        if (refresh_token) {
          const payload = await getNewToken(refresh_token);
          if (payload) {
            const token = payload.accessToken;
            const user = payload.user;

            // Redirect with the Set-Cookie header
            return createUserSession({
              request,
              token,
              redirectTo,
              user,
            });
          }
        }
        // If no refresh token or new token is available, logout the user
        throw await logout(request);

      default:
        throw new Error('Unexpected status');
    }
  }
};

const GlobalLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default GlobalLayout;
