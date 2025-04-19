import { Link } from '@remix-run/react';
import Chevron from '../icons/Chevron';
import { Product } from '~/types';
import { urlUtils } from '~/utils/url.util';

const Computers: React.FC<{
  computers: Product[] | undefined;
  error: string | undefined;
}> = ({ computers, error }) => {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <p className='text-sm md:text-base'>
          <span className='text-primary font-semibold'>Computers</span> Built
          for Everything!
        </p>
        <div className='flex items-center'>
          <Link
            to={`products/category/${urlUtils.createSlug('Computers')}`}
            className='text-xs'>
            View All
          </Link>
          <Chevron className='size-4 -rotate-90 text-blue-400 ' />
        </div>
      </div>
      <hr className='h-[2px] w-full bg-gray-300 mb-6' />
      <div className='md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 flex flex-col'>
        {computers ? (
          computers.map((computer) => {
            return (
              <div
                key={computer.id}
                className='hover:shadow-xl hover:scale-105'>
                <div
                  className='h-64 overflow-clip flex items-center bg-cover bg-center'
                  style={{ backgroundImage: `url(${computer.imgUrl})` }}>
                  {/* Content goes here */}
                </div>
                <div className='bg-white p-2.5 flex flex-col gap-1 shadow-lg rounded-b-lg'>
                  <Link
                    to={`${computer.id}`}
                    className='text-primary hover:text-secondary font-space'>
                    {computer.name}
                  </Link>
                  <p className='text-slate-400 italic text-sm'>No reviews</p>
                  <p>₦ {computer.price}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className='text-red-500 capitalize'>{error}</p>
        )}
      </div>
    </div>
  );
};

export default Computers;
