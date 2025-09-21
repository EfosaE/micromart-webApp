import { LoaderFunctionArgs, redirect } from 'react-router';
import { Outlet, useLoaderData } from 'react-router';
import MenuComp from '~/components/Menu';
import { getUser } from '~/services/api/user.api';
import {  User } from '~/types';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUrl = new URL(request.url); // Get the current URL
  const redirectTo = currentUrl.pathname + currentUrl.search; // Preserve the path and query parameters

  const user = await getUser(request);
  console.log('getuserProtected', user);
  if (!user) {
    const encodedRedirectTo = encodeURIComponent(redirectTo);

    // Redirect to login with the encoded redirectTo query parameter
    throw redirect(`/login?redirectTo=${encodedRedirectTo}`);
  }

  if (user) {
    return user;
  }
};


const ProtectedLayout = () => {
  const user  = useLoaderData<User>();

  return (
    <main className='container'>
      <Outlet />
    </main>
  );
};

export default ProtectedLayout;
