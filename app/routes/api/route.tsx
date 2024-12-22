import { ActionFunctionArgs, createCookie } from '@remix-run/node';

export async function action({ request }: ActionFunctionArgs) {
  const cookiesHeader = request.headers.get('cookie');
  // Log the cookies to see what is being sent with the request
  // Parse the refresh token cookie cookies
  const refreshTokenCookie = createCookie('refresh_token');

  const refresh_token = await refreshTokenCookie.parse(cookiesHeader);

  console.log('action called:', refresh_token);
  // // Call the function to refresh the token

  // return getNewToken(refresh_token, request);

  // return new Response(null, {
  //   status: 302,
  //   headers: {
  //     Location: '/',
  //   },
  // });

  //   // Return a response with the new token
  //   return new Response(JSON.stringify({ message: 'Token refreshed!' }), {
  //     status: 200,
  //     headers: { 'Content-Type': 'application/json' },
  //   });
}
