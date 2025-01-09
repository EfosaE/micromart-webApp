import { User } from '~/types';
import Chevron from './icons/Chevron';
import { Link } from '@remix-run/react';
import { useState } from 'react';
interface MenuProps {
  user: User;
}
const MenuComp = ({ user }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  function handleToggle() {
    setIsOpen(!isOpen);
  }
  return (
    <div>
      <div className='flex'>
        <div className='flex gap-2 hover:opacity-75 cursor-pointer' onClick={handleToggle}>
          Welcome{' '}
          <span className='flex items-center text-tertiary'>
            {user.name} <Chevron className={`size-4 ${isOpen && 'rotate-180'}`} />
          </span>
        </div>
      </div>
      <div
        className={`${
          isOpen ? 'absolute ' : 'hidden'
        } top-7 bg-gray-50 left-1 w-52 origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 rounded shadow-lg`}>
        <div>
          <Link
            to={'/create-product'}
            prefetch='viewport'
            className='block w-full p-1.5 text-sm text-left data-[focus]:bg-secondary decoration-gray-200 decoration-2'>
            My Account
          </Link>
        </div>
        <div>
          <Link
            to={'/create-product'}
            prefetch='viewport'
            className='block w-full p-1.5 text-sm text-left data-[focus]:bg-secondary decoration-gray-200 decoration-2'>
            Orders
          </Link>
        </div>
        <div>
          <Link
            to={'/create-product'}
            prefetch='viewport'
            className='block w-full p-1.5 text-sm text-left data-[focus]:bg-secondary decoration-gray-200 decoration-2'>
            Create Product
          </Link>
        </div>
        {user.activeRole === 'VENDOR' && (
          <div>
            <Link
              to={'/create-product'}
              prefetch='viewport'
              className='block w-full p-1.5 text-sm text-left data-[focus]:bg-secondary decoration-gray-200 decoration-2'>
              Create Product
            </Link>
          </div>
        )}
        <hr className='bg-slate-400 h-[2px]' />
        <div>
          <form action='/logout' method='post'>
            <button
              type='submit'
              className='block p-1.5 w-full text-sm text-red-700 text-left data-[focus]:bg-secondary decoration-gray-200 decoration-2'>
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuComp;
