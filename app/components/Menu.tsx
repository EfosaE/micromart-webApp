import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { User } from '~/types';
import Chevron from './icons/Chevron';
interface MenuProps {
    user: User,
}
const MenuComp = ({user}:MenuProps) => {
  return (
    <Menu>
      <MenuButton className='flex data-[active]:text-primary'>
        <div className='flex gap-2'>
          Welcome{' '}
          <span className='flex items-center text-tertiary'>
            {user.name} <Chevron className='size-4' />
          </span>
        </div>
      </MenuButton>
      <MenuItems
        anchor='bottom start'
        transition
        className='w-52 p-1 origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 rounded shadow-lg bg-slate-100'>
        <form action='/logout' method='post'>
          <MenuItem>
            <button
              type='submit'
              className='block w-full text-sm text-left data-[focus]:bg-violet-100 underline decoration-gray-200 decoration-2'>
              Sign out
            </button>
          </MenuItem>
        </form>
      </MenuItems>
    </Menu>
  );
};

export default MenuComp;
