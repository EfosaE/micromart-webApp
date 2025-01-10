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
  isUserWithAccessToken,
} from '~/types';
import { initializeRedis } from './redis.server';

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
      maxAge: 60 * 60 * 24, // 1 day
    })
  );

  headers.append(
    'Set-Cookie',
    await userSessionStorage.commitSession(userSession, {
      maxAge: 60 * 60 * 12, // 12 hrs
    })
  );


  return redirect(redirectTo, {
    headers,
  });
}

export async function getAccessToken(request: Request) {
  const authSession = await getAuthSession(request);
  const access_token: string | undefined = authSession.get('access_token');

  return access_token;
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



export async function logout(request: Request) {
  const refreshTokenCookie = createCookie('refresh_token');

  const authSession = await getAuthSession(request);
  const userSession = await getUserSession(request);
  // Create a deletion header
  const deleteCookieHeader = await refreshTokenCookie.serialize('', {
    expires: new Date(0), // Expire immediately
  });
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
  headers.append('Set-Cookie', deleteCookieHeader);

  // Redirect to login with the encoded redirectTo query parameter
  return redirect('/', { headers });
}
