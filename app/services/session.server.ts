import { createCookieSessionStorage, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getUserProfile } from './api/auth.api';
import { isUser } from '~/types';

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set');

// Define the session storage
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session', // Name of the cookie
    secrets: [process.env.SESSION_SECRET], // Replace with your secret key for encrypting the session
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure in production only
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

export async function createUserSession({
  request,
  token,
  redirectTo,
  authCookie,
}: {
  request: Request;
  token: string;
  redirectTo: string;
  authCookie: string;
}) {
  const session = await getSession(request);
  session.set('access_token', token); // Store access token in session
  const headers = new Headers();
  // Append each cookie separately
  headers.append('Set-Cookie', authCookie);
  headers.append(
    'Set-Cookie',
    await sessionStorage.commitSession(session, {
      maxAge: 60 * 60 * 20, // 20 mins
    })
  ); // Append each cookie separately
  return redirect(redirectTo, {
    headers,
  });
}

export async function getUserFromToken(access_token: string) {
  const result = await getUserProfile(access_token);
  console.log(result);
  if (result.success) {
    return result.data;
  } else {
    return null;
  }
}

export async function getUserData(request: Request) {
  const session = await getSession(request);
  const access_token = session.get('access_token');
  const userData = await getUserFromToken(access_token);
  console.log('userInfo', userData);
  if (userData && isUser(userData)) {
    return userData; 
  }
  throw await logout(request);
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}
