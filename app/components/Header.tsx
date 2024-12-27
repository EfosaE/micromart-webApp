import { useMatches } from '@remix-run/react';
import Banner from './Banner';
import Navbar from './Navbar';
import { User } from '~/types';

const Header = () => {
  const matches = useMatches();

  // console.log(matches)
  // Find the parent route's data
  const layoutData = matches.find((match) => match.id === 'root')?.data as {
    user: User | null
  };

  const user = layoutData?.user;
  return (
    <header>
      <Banner />
      <Navbar user={user} />
    </header>
  );
};

export default Header;
