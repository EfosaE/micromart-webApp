import { createCookie, redirect } from '@remix-run/node'; // or cloudflare/deno

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
    secure: true,
  });
  // process.env.NODE_ENV === 'production' ? true :
  // Set the expiration dynamically from settings
  const expires = settings.expires ? new Date(settings.expires) : undefined;

  // Await the serialized cookie
  const serializedAuthCookie = await cookie.serialize(value, {
    expires: expires,
    maxAge: settings['max-age'] ? parseInt(settings['max-age'], 10) : undefined,
  });

  return serializedAuthCookie;
}


