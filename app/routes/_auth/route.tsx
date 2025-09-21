import { Form, Link, Outlet } from 'react-router';
import AuthHeader from './header';
import GIcon from '../../assets/search.png'
import { Button } from '~/components/Button';

const AuthLayout = () => {

  return (
    <div className='flex flex-col justify-center items-center bg-white'>
      <div className='sm:w-[480px] p-8 w-full min-h-screen flex flex-col items-center justify-center'>
        <AuthHeader />
        <Outlet />

        <form
          action='/google'
          className='w-full  border-2 my-2 flex items-center justify-center rounded-md'>
          <Button
            label={
              <div className='flex gap-2 items-center justify-center'>
                <img src={GIcon} alt='' className='size-4' />
                <span className='text-black hover:text-gray-600'>
                  Sign In With Google
                </span>
              </div>
            }
            styles={['bg-white', '', 'hover:bg-white']}
          />
        </form>
      </div>
    </div>
  );
};

export default AuthLayout;
