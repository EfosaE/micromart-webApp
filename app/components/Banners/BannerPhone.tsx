import React from 'react'

const BannerPhone = () => {
  return (
    <div className='flex flex-col justify-center items-start pl-8 text-white space-y-4'>
      <h1 className='text-3xl font-bold'>Best Deal Online on Smart Watches</h1>
      <p className='text-lg leading-6'>
        Discover top-quality smartwatches with advanced features. Track your
        health, stay connected, and look stylish—all at unbeatable prices.
      </p>
      <div className='flex space-x-4'>
        <button className='bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600'>
          Shop Now
        </button>
        <button className='bg-transparent border border-white text-white py-2 px-6 rounded-lg hover:bg-white hover:text-blue-500'>
          Learn More
        </button>
      </div>
    </div>
  );
}

export default BannerPhone