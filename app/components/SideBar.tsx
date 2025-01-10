import { useSidebar } from '~/hooks/SideBarContext';
import XMark from './icons/XMark';
import { User } from '~/types';
import { Link } from '@remix-run/react';
import { dropDownLinks } from '~/data';
import Chevron from './icons/Chevron';
interface SideBarProps {
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
            <Link
              to={'/login'}
              className='text-secondary underline underline-offset-2'>
              Sign Into Your Account
            </Link>
          )}
        </div>
      </div>
      <div>
        <div className='bg-gray-100 w-full py-2'>
          <p className='px-[26px] font-space text-sm'>MY ACCOUNT</p>
        </div>
        <ul className='px-[26px]'>
          {dropDownLinks.map((link) => {
            return (
              <div className='flex items-center justify-between' key={link.name}>
                <div className='flex items-center'>
                  {link.icon}
                  <Link to={link.to} className='py-3 text-sm' onClick={closeSidebar}>
                    {link.name}
                  </Link>
                </div>

                <Chevron className='size-4 -rotate-90' />
              </div>
            );
          })}
        </ul>
      </div>

      <div className='flex-end'>
        <form action='/logout' method='post'>
          <button
            type='submit'
            className='block p-1.5 w-full text-red-700 text-center'>
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
};

export default SideBar;
