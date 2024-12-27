const Banner = () => {
  return (
    <div className='bg-secondary font-klee text-white py-2 hidden md:block'>
      <div className='container flex justify-around items-center h-3 '>
        <div className='overflow-hidden w-[200px]'>
          <p className='text-sm whitespace-nowrap animate-marquee'>
            Welcome to Micromart.
          </p>
        </div>
        <div className='bg-white h-full w-[1px]'></div>
        <div className='text-sm'>Free Shipping...</div>
        <div className='bg-white h-full w-[1px]'></div>
        <div className='text-sm'>Order Now!</div>
      </div>
    </div>
  );
};

export default Banner;
