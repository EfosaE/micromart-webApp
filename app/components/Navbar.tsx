import { Link, useFetcher, useNavigate } from '@remix-run/react';
import logo from '~/assets/micromart.png';
import UserIcon from './icons/UserIcon';
import SearchIcon from './icons/SearchIcon';
import CartIcon from './icons/CartIcon';
import { CartItem, Product, User } from '~/types';
import MenuComp from './Menu';
import { Button } from './Button';
import Tags from './Tags';
import Bars from './icons/Bars';
import { useSidebar } from '~/hooks/SideBarContext';
import SideBar from './SideBar';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useEffect } from 'react';

interface NavbarProps {
  /* list of props */
  user: User | null;
  cart: CartItem[] | null;
}

const Navbar = ({ user, cart }: NavbarProps) => {
  const { openSidebar } = useSidebar();
  const navigate = useNavigate();

  console.log(user);
  return (
    <nav className='sticky top-0 z-10 bg-white'>
      <SideBar user={user} />
      {/* Mobile NavBar */}
      <div className='container flex items-center justify-between py-4 lg:hidden'>
        <div className='flex gap-2 items-center'>
          <Bars className=' size-6' onClick={openSidebar} />
          <div className='flex items-center gap-1'>
            <img src={logo} alt='Micromart Logo' className='size-6' />
            <h1 className='text-primary font-semibold text-xl'>MicroMart</h1>
          </div>
        </div>

        <div className='flex gap-3 items-center text-primary'>
          <SearchIcon
            className='size-8'
            onClick={() => {
              navigate('/search');
            }}
          />
          <div className='relative'>
            <CartIcon className='size-8' />
            {cart && cart.length > 0 && (
              <p className='absolute -top-1 -right-1.5 text-white bg-secondary rounded-full text-[12px] flex items-center justify-center w-6 h-6'>
                {cart.reduce((total, item) => total + item.cartQuantity, 0)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/*Tablets and Above NavBar */}
      <div className='container hidden lg:flex gap-4 items-center justify-between py-4'>
        <div className='flex items-center gap-2'>
          <img src={logo} alt='Micromart Logo' className='size-10' />
          <h1 className='text-primary font-semibold text-3xl'>MicroMart</h1>
        </div>

        <div className='relative flex   flex-col md:flex-row items-center gap-1 w-[420px]'>
          <span className='absolute left-2'>
            <SearchIcon className='text-secondary  size-6' />
          </span>
          <input
            className='bg-tertiary bg-opacity-10 py-2 px-10 focus:border rounded-md w-full  focus:border-secondary focus:outline-none  focus:ring-2 focus:ring-purple-500 placeholder:text-sm placeholder:text-gray-500'
            placeholder='search essentials, groceries and more...'
            autoComplete='off'
          />

          <Button label={'Search'} styles={['w-fit']} />
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex items-center relative'>
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
          <div
            className='flex items-center gap-1 relative'
            onClick={() => {
              navigate('/cart');
            }}>
            <CartIcon className='text-secondary cursor-pointer hover:text-primary ' />
            <Link to={'/cart'} className='text-sm hover:text-slate-500'>
              Cart
            </Link>
            {cart && cart.length > 0 && (
              <p className='text-white bg-secondary rounded-full text-xs flex items-center justify-center w-8 h-8'>
                {cart.reduce((total, item) => total + item.cartQuantity, 0)}
              </p>
            )}
          </div>
        </div>
      </div>
      <Tags />
    </nav>
  );
};

export default Navbar;
