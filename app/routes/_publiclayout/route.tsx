// import type { LoaderFunction } from '@remix-run/node';
// import { getUserDataFromSession } from '~/services/session.server';

// const API_BASE_URL = 'https://api.example.com/products';

// export const loader: LoaderFunction = async ({ request }) => {
//   const url = new URL(request.url);
//   const tag = url.searchParams.get('tag');

//   // Fetch products (publicly accessible)
//   const apiUrl = tag ? `${API_BASE_URL}?tag=${tag}` : API_BASE_URL;
//   const response = await fetch(apiUrl);
//   const products = await response.json();

//   // Optionally fetch user data (for personalization)
//   const userResponse = await getUserDataFromSession(request);
//   const user =
//     userResponse && userResponse.status === 200 ? userResponse.user : null;

//   return new Response(JSON.stringify({ products, user }), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' },
//   });
// };
