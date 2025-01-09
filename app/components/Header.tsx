import { Link, useMatches } from '@remix-run/react';
import Banner from './Hero';
import Navbar from './Navbar';
import { User } from '~/types';
import Tags from './Tags';

const Header = () => {
  const matches = useMatches();

  // console.log(matches)
  // Find the parent route's data
  const layoutData = matches.find((match) => match.id === 'root')?.data as {
    user: User | null;
  };

  const user = layoutData?.user;
  return (
    <header>
      <div className='bg-tertiary bg-opacity-20 py-1 flex items-center justify-center'>
        <Link
          to={'/register/vendor'}
          className='text-primary text-xs underline underline-offset-1'>
          Sell on Micromart
        </Link>
      </div>
    </header>
  );
};

export default Header;
