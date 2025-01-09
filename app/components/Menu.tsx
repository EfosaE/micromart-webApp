import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { User } from '~/types';
import Chevron from './icons/Chevron';
import { Link } from '@remix-run/react';
interface MenuProps {
  user: User;
}
const MenuComp = ({ user }: MenuProps) => {
  return (
    <Menu>
      <MenuButton className='flex data-[active]:text-primary'>
        <div className='flex gap-2 hover:opacity-75'>
          Welcome{' '}
          <span className='flex items-center text-tertiary'>
            {user.name} <Chevron className='size-4' />
          </span>
        </div>
      </MenuButton>
      <MenuItems
        anchor='bottom start'
        transition
        className='w-52 origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 rounded shadow-lg bg-slate-50'>
        <form action='/logout' method='post'>
          <MenuItem>
            <Link
              to={'/create-product'}
              prefetch='viewport'
              className='block w-full p-1.5 text-sm text-left data-[focus]:bg-secondary decoration-gray-200 decoration-2'>
              Orders
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to={'/create-product'}
              prefetch='viewport'
              className='block w-full p-1.5 text-sm text-left data-[focus]:bg-secondary decoration-gray-200 decoration-2'>
              Create Product
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to={'/create-product'}
              prefetch='viewport'
              className='block w-full p-1.5 text-sm text-left data-[focus]:bg-secondary decoration-gray-200 decoration-2'>
              Create Product
            </Link>
          </MenuItem>
          {user.activeRole === 'VENDOR' && (
            <MenuItem>
              <Link
                to={'/create-product'}
                prefetch='viewport'
                className='block w-full p-1.5 text-sm text-left data-[focus]:bg-secondary decoration-gray-200 decoration-2'>
                Create Product
              </Link>
            </MenuItem>
          )}
          <hr className='bg-slate-400 h-[2px]'/>
          <MenuItem>
            <button
              type='submit'
              className='block p-1.5 w-full text-sm text-red-700 text-left data-[focus]:bg-secondary decoration-gray-200 decoration-2'>
              Sign Out
            </button>
          </MenuItem>
        </form>
      </MenuItems>
    </Menu>
  );
};

export default MenuComp;
