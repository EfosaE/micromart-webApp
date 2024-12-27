import {
  createCookie,
  createCookieSessionStorage,
  redirect,
} from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getNewToken, getUserProfile } from './api/auth.api';
import {
  isUser,
  SuccessResponse,
  User,
  ErrorResponse,
  isSuccessResponse,
  isErrorResponse,
} from '~/types';

invariant(process.env.USER_SESSION_SECRET, 'USER_SESSION_SECRET must be set');
invariant(process.env.AUTH_SESSION_SECRET, 'AUTH_SESSION_SECRET must be set');

// Session 1 for authentication token
export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__auth_session',
    secrets: [process.env.AUTH_SESSION_SECRET],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
});

// Session 2 for user data & preferences
export const userSessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__user_session',
    secrets: [process.env.USER_SESSION_SECRET],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function getAuthSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return authSessionStorage.getSession(cookie);
}
export async function getUserSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return userSessionStorage.getSession(cookie);
}

//utility function for login and refresh token
export async function createUserSession({
  request,
  token,
  redirectTo,
  authCookie,
  user,
}: {
  request: Request;
  token: string;
  redirectTo: string;
  authCookie?: string;
  user: User;
}) {
  const authSession = await getAuthSession(request);
  const userSession = await getUserSession(request);

  // Unset existing token (if any) to avoid stale data, for refresh endpoint
  authSession.unset('access_token');

  // Set token and profile in session
  authSession.set('access_token', token);
  userSession.set('user_profile', user);

  const headers = new Headers();
  // Append each cookie separately
  if (authCookie) headers.append('Set-Cookie', authCookie);
  headers.append(
    'Set-Cookie',
    await authSessionStorage.commitSession(authSession, {
      maxAge: 60 * 20, // 20 minutes = 1200 seconds
    })
  );
  headers.append(
    'Set-Cookie',
    await userSessionStorage.commitSession(userSession, {
      maxAge: 60 * 15, // 15 minutes = 1200 seconds
    })
  );

  console.log(redirectTo, headers);

  return redirect(redirectTo, {
    headers,
  });
}

export async function getAccessToken(request: Request) {
  const authSession = await getAuthSession(request);
  const access_token: string | undefined = authSession.get('access_token');

  return access_token;
}

export async function getUserDataFromBE(
  request: Request
): Promise<SuccessResponse | ErrorResponse> {
  console.log('BE called');
  const access_token = await getAccessToken(request);
  if (access_token) {
    // call profile endpoint for new user details
    const response = await getUserProfile(access_token);
    console.log('getUserProfile', response);
    return response;
  }
  // return 403 so refresh endpoint is called by the layout loader for new accesstoken and new user details using refresh cookie
  return { success: false, error: 'no access token', statusCode: 403 };
}

export async function getUserDataFromSession(
  request: Request
): Promise<User | null> {
  const userSession = await getUserSession(request);
  const user: User | undefined | null = userSession.get('user_profile');
  if (user && isUser(user)) {
    return user;
  }
  return null;
}

export async function getUser(request: Request) {
  // 1. Try getting user from session
  const user = await getUserDataFromSession(request);
  console.log('session called', user);
  if (user) {
    return user;
  }

  // 2. If no session, call the backend to fetch user
  const response = await getUserDataFromBE(request);

  if (isSuccessResponse(response)) {
    return response.data; // Return user directly if successful
  }

  // 3. If backend returns error, check for refresh token
  if (isErrorResponse(response)) {
    const cookiesHeader = request.headers.get('cookie');
    const refreshTokenCookie = createCookie('refresh_token');
    const refresh_token = await refreshTokenCookie.parse(cookiesHeader);
    // 4. Try refreshing the token if refresh token exists
    if (refresh_token) {
      const response = await getNewToken(refresh_token);
      console.log('getNewToken', response);
      if (response.success) {
        const { user, accessToken } = response.data;
        return { user, accessToken };
      } else {
        return null;
      }
    }
  }
  return null;
}

export async function logout(request: Request) {
  const authSession = await getAuthSession(request);
  const userSession = await getUserSession(request);

  const headers = new Headers();

  // Append both Set-Cookie headers
  headers.append(
    'Set-Cookie',
    await authSessionStorage.destroySession(authSession)
  );
  headers.append(
    'Set-Cookie',
    await userSessionStorage.destroySession(userSession)
  );

  // Redirect to login with the encoded redirectTo query parameter
  return redirect('/', { headers });
}
