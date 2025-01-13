import { User } from '~/types';
import Chevron from './icons/Chevron';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import { dropDownLinks } from '~/data';
import Pencil from './icons/Pencil';
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
        <div
          className='flex gap-2 hover:opacity-75 cursor-pointer'
          onClick={handleToggle}>
          Welcome{' '}
          <span className='flex items-center text-tertiary'>
            {user.name}{' '}
            <Chevron className={`size-4 ${isOpen && 'rotate-180'}`} />
          </span>
        </div>
      </div>
      <div
        className={`${
          isOpen ? 'absolute ' : 'hidden'
        } top-7 bg-gray-50  py-1 left-1 w-64 origin-top transition duration-200 ease-out rounded shadow-lg`}>
        <ul className=''>
          {dropDownLinks.map((link) => {
            return (
              <li
                className='flex px-4  gap-0.5 items-center hover:bg-tertiary hover:text-white'
                key={link.name}>
                {link.icon}
                <Link to={link.to} className='py-3 text-sm '>
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
        {user.activeRole === 'VENDOR' && (
          <div className='flex px-4  gap-0.5 items-center hover:bg-tertiary hover:text-white'>
            <Pencil className='size-6 mr-2' />
            <Link
              to={'/account/create-product'}
              prefetch='viewport'
              className='block w-full p-1.5 text-sm text-left data-[focus]:bg-secondary decoration-gray-200 decoration-2'>
              Create Product
            </Link>
          </div>
        )}
        <hr className='bg-slate-400 h-[2px]' />
        <div className='flex items-center justify-center  hover:bg-gray-300'>
          <form action='/logout' method='post'>
            <button
              type='submit'
              className='block p-1.5 w-full text-sm text-red-700'>
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuComp;
