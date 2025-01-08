import { Link } from '@remix-run/react';
import logo from '~/assets/micromart.png';
import UserIcon from './icons/UserIcon';
import SearchIcon from './icons/SearchIcon';
import CartIcon from './icons/CartIcon';
import { User } from '~/types';
import MenuComp from './Menu';

interface NavbarProps {
  /* list of props */
  user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  console.log(user);
  return (
    <nav className='py-4'>
      <div className='container flex flex-col lg:flex-row gap-4 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <img src={logo} alt='Micromart Logo' className='size-10' />
          <h2 className='text-primary'>MicroMart</h2>
        </div>

        <div className='relative flex items-center  w-96'>
          <span className='absolute left-2'>
            <SearchIcon className='text-secondary ' />
          </span>
          <input
            className='bg-tertiary bg-opacity-10 py-3 px-10 focus:border rounded-md w-full  focus:border-secondary focus:outline-none  focus:ring-2 focus:ring-purple-500 placeholder:text-sm placeholder:text-gray-500'
            placeholder='search essentials, groceries and more...'
            autoComplete='off'
          />
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex items-center'>
            <UserIcon className='text-secondary cursor-pointer hover:text-primary size-6' />
            {user ? (
              <MenuComp user={user} />
            ) : (
              <Link to={'/login'} className='text-sm hover:text-slate-500'>
                Sign In/Sign Up
              </Link>
            )}
          </div>
          <div className='bg-gray-400 w-[1px] h-8'></div>
          <div className='flex items-center gap-1'>
            <CartIcon className='text-secondary cursor-pointer hover:text-primary ' />
            <Link to={'/cart'} className='text-sm hover:text-slate-500'>
              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
