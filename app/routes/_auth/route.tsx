import { Outlet } from '@remix-run/react';
import AuthHeader from './header';

const AuthLayout = () => {
  return (
    <div className='flex flex-col justify-center items-center bg-white'>
      <div className='sm:w-[480px] p-8 w-full min-h-screen flex flex-col items-center justify-center'>
        <AuthHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
