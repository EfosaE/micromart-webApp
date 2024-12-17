import { Outlet } from '@remix-run/react';
import AuthHeader from './header';

const AuthLayout = () => {
  return (
    <main>
      <AuthHeader />
      <Outlet />
    </main>
  );
};

export default AuthLayout;
