import { createCookieSessionStorage, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getUserProfile } from './api/auth.api';
import { isUser, User } from '~/types';

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
  console.log('redirectUrl', redirectTo);
  const authSession = await getAuthSession(request);
  const userSession = await getUserSession(request);
  console.log('Initial session:', authSession.data);

  // Unset existing token (if any) to avoid stale data, for refresh endpoint
  authSession.unset('access_token');
  console.log('Old access_token cleared.');

  console.log('accesstoken', token);
  console.log('user', user);

  // // Set the new token
  // session.set('access_token', token);

  // Set token and profile in session
  authSession.set('access_token', token);
  userSession.set('user_profile', user);

  console.log('New auth session data:', authSession.data);

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
  console.log('Final headers:', headers);
  return redirect(redirectTo, {
    headers,
  });
}




export async function getUserDataFromBE(request: Request) {
  const cookiesHeader = request.headers.get('Cookie');
  console.log('loader called', cookiesHeader)
  
  const authSession = await getAuthSession(request);
  const access_token: string | undefined = authSession.get('access_token');
  console.log('access_token', access_token)
  // call NestJS BE
  if (access_token) {
    const user = await getUserProfile(access_token);
    if (user && isUser(user)) {
      return { status: 200, user };
    }
    // call refresh... BE gave an error
    return { status: 403, error: 'access_token expired' };
  }
   // call refresh... access_token is undefined
   return { status: 403, error: 'access_token expired or deleted' };
}

export async function getUserDataFromSession(request: Request) {
  const userSession = await getUserSession(request);
  const user: User | undefined | null = userSession.get('user_profile');
  if (user && isUser(user)) {
    return { status: 200, user };
  } else {
    // user session has expired; it has been deleted... call the BE
    const response = await getUserDataFromBE(request);
    return response;
  }
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

  // Redirect with both cookies being cleared
  return redirect('/login', { headers });
}
