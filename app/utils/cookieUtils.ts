// Utility function to parse a single cookie string
export function parseCookie(cookieString: string) {
  const cookieParts = cookieString.split('; ');
  const [name, value] = cookieParts[0].split('=');

  const cookieSettings: Record<string, string | boolean> = {};

  cookieParts.slice(1).forEach((part) => {
    const [key, val] = part.split('=');
    cookieSettings[key.toLowerCase()] = val === undefined ? true : val; // `true` for flags like `HttpOnly`
  });

  return { name, value, settings: cookieSettings };
}

// Function to parse all cookies in the Set-Cookie header 
export function parseSetCookieHeader(cookies: string[]) {
  return cookies.map(parseCookie);
}
