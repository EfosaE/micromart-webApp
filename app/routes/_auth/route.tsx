import { Outlet } from '@remix-run/react';
import AuthHeader from './header';

const AuthLayout = () => {
  return (
    <main className='h-screen container flex flex-col justify-center items-center lg:px-[480px]'>
      <AuthHeader />
      <Outlet />
    </main>
  );
};

export default AuthLayout;
