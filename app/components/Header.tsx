import { Link, useMatches } from 'react-router';
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
      <div className='hidden md:flex bg-tertiary py-1 items-center justify-center'>
        <Link
          to={'/register/vendor'}
          className='text-white hover:text-slate-400 text-xs underline underline-offset-1'>
          Sell on Micromart
        </Link>
      </div>
    </header>
  );
};

export default Header;
