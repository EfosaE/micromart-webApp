import { NavLink } from '@remix-run/react';
import React from 'react';

const AuthHeader = () => {
  return (
    <div className='space-y-2 mb-4'>
      <h3 className='font-space font-bold  text-4xl text-primary'>
        Micromart
      </h3>
      <div className='flex gap-4 items-center justify-center '>
        <NavLink to='/register'>Sign Up</NavLink>
        <NavLink to='/login'>Sign In</NavLink>
      </div>
      <hr className='w-full  border-t-1 border-neutral-400' />
    </div>
  );
};

export default AuthHeader;
