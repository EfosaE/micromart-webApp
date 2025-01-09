import { useState } from 'react';
import { useSidebar } from '~/hooks/SideBarContext';
import XMark from './icons/XMark';
import { User } from '~/types';
import { Link } from '@remix-run/react';
import { dropDownLinks } from '~/data';
interface SideBarProps {
  /* list of props */
  user: User | null;
}
const SideBar = ({ user }: SideBarProps) => {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  return (
    <aside
      className={` bg-white absolute lg:hidden inset-0 z-50  shadow-lg flex flex-col gap-3  py-[32px] h-screen overflow-scroll transition  ${
        isSidebarOpen ? 'translate-x-0 w-full' : ' -translate-x-full'
      }`}>
      <div className='flex flex-row-reverse justify-between px-[26px]'>
        <XMark className='size-6 cursor-pointer' onClick={closeSidebar} />
        <div>
          {user ? (
            <div>
              <h3 className='font-semibold text-lg'>{user.name}</h3>
              <Link to={'/'} className='text-primary font-bold text-sm '>
                {' '}
                ACCOUNT SETTINGS
              </Link>
            </div>
          ) : (
            <Link to={'/login'} className='text-sm'>
              Sign In/Sign Up
            </Link>
          )}
        </div>
      </div>
      <div>
        <div className='bg-slate-300 w-full py-2'>
          <p className='px-[26px] font-space'>MY ACCOUNT</p>
        </div>
        <ul className='px-[26px]'>
          {dropDownLinks.map((link) => {
            return (
              <div className='flex items-center'>
                {link.icon}
                <Link to={link.to} className='py-3'>{link.name}</Link>
              </div>
            )
          })}
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
