import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { getUserData } from '~/services/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserData(request);
  console.log('user', user);
  return new Response(JSON.stringify({ user }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

const GlobalLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default GlobalLayout;
