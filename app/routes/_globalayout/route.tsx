import { Outlet } from '@remix-run/react';

import Footer from '~/components/Footer';
import Navbar from '~/components/Navbar';

const GlobalLayout = () => {
  return (
    <main>
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
};

export default GlobalLayout;
