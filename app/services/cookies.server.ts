import { createCookie, redirect } from '@remix-run/node'; // or cloudflare/deno

export let authCookie: string;

// Utility function to create cookies
export async function createAuthCookie(
  name: string,
  value: string,
  settings: any
) {
  const cookie = createCookie(name, {
    httpOnly: settings.httponly || true,
    path: settings.path || '/',
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    domain: process.env.NEST_API_URL, // Set the domain explicitly
  });

  // Set the expiration dynamically from settings
  const expires = settings.expires ? new Date(settings.expires) : undefined;

  // Await the serialized cookie
  const serializedAuthCookie = await cookie.serialize(value, {
    expires: expires,
    maxAge: settings['max-age'] ? parseInt(settings['max-age'], 10) : undefined,
  });
  authCookie = serializedAuthCookie;
  return serializedAuthCookie;
}
