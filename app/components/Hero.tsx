import { useEffect, useState } from 'react';
import bgPhoneImg from '~/assets/iphonebg.jpg';
import bgFashionImg from '~/assets/fashion.jpg';
import bgLaptopImg from '~/assets/macprobg.jpg';
import bgApplianceImg from '~/assets/washingmachine.jpg';
import bgWatchImg from '~/assets/smartwatch.jpg';
import Chevron from './icons/Chevron';
import { AppButton } from './Button';

const content = [
  {
    title: 'Best Deal Online on Smart Watches',
    description:
      'Discover top-quality smartwatches with advanced features. Track your health, stay connected, and look stylish—all at unbeatable prices.',
    button1: 'Shop Now',
    button2: 'Learn More',
    imgUrl: bgWatchImg,
  },
  {
    title: 'Exclusive Discounts on Laptops',
    description:
      'Find the perfect laptop for work or play. Enjoy amazing deals on the latest models with cutting-edge technology.',
    button1: 'Explore Laptops',
    button2: 'View Offers',
    imgUrl: bgLaptopImg,
  },
  {
    title: 'Upgrade Your Home Appliances',
    description:
      'Save big on home appliances to make your life easier. Modern designs and top performance at unbeatable prices.',
    button1: 'Shop Appliances',
    button2: 'Browse More',
    imgUrl: bgApplianceImg,
  },
  {
    title: 'Amazing Deals on Smartphones',
    description:
      'Get the latest smartphones with cutting-edge features and stylish designs. Stay connected with high-performance devices at unbeatable prices.',
    button1: 'Browse Phones',
    button2: 'View Offers',
    imgUrl: bgPhoneImg,
  },
  {
    title: 'Stylish Apparel for Every Season',
    description:
      'Discover the latest trends in fashion with our curated collection of clothing and accessories. From chic casuals to elegant formal wear, we have something for every style and occasion.',
    button1: 'Shop Now',
    button2: 'Explore Collections',
    imgUrl: bgFashionImg,
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // Animation control state
  const [currentBg, setCurrentBg] = useState(content[currentIndex].imgUrl); // Initial background image state

  const handlePrevious = () => {
    if (isAnimating) return; // Prevent clicking while animating
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? content.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
    }, 500); // Match the animation duration
  };

  const handleNext = () => {
    if (isAnimating) return; // Prevent clicking while animating
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === content.length - 1 ? 0 : prevIndex + 1
      );
      setIsAnimating(false);
    }, 500); // Match the animation duration
  };

  // Update the background image only after the transition completes
  useEffect(() => {
    if (!isAnimating) {
      setCurrentBg(content[currentIndex].imgUrl); // Update background image after the transition
    }
  }, [currentIndex, isAnimating]);

  // // Auto-slide functionality
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     handleNext();
  //   }, 5000); // Change every 5 seconds

  //   // Cleanup the timer on component unmount
  //   return () => clearInterval(timer);
  // }, [currentIndex]);

  return (
    <div className='mb-4 px-4 '>
      <div
        className={`bg-cover bg-center bg-no-repeat h-96 md:h-64 rounded-2xl w-full py-10 px-3 flex justify-start items-center relative
        `}
        style={{ backgroundImage: `url(${currentBg})` }}>
        {/* Overlay */}
        <div className='absolute inset-0 bg-black bg-opacity-60 rounded-2xl'></div>
        <div className='absolute transform left-0  -translate-x-1/2 rotate-90 bg-white p-1.5 rounded-full cursor-pointer'>
          <div
            className='rounded-full p-2 bg-[#F3F9FB] '
            onClick={handlePrevious}>
            <Chevron className='size-6 text-[#008ECC]' />
          </div>
        </div>

        {/* Content Section */}
        <div
          className={`flex flex-col justify-center items-start px-8 text-white space-y-4 transition-all duration-500 transform ${
            isAnimating
              ? 'opacity-0 -translate-x-10'
              : 'opacity-100 translate-x-0'
          }`}>
          <h1 className='md:text-3xl text-2xl font-bold font-space'>
            {content[currentIndex].title}
          </h1>
          <p className='text-sm md:text-base'>{content[currentIndex].description}</p>
          <div className='flex sm:flex-row flex-col gap-3'>
            <AppButton label={content[currentIndex].button1} />
            <AppButton
              label={content[currentIndex].button2}
              className= 'hover:bg-tertiary font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-slate-400'
            />
           
          </div>
        </div>

        <div className='bg-white p-1.5 right-0 rounded-full absolute transform translate-x-1/2 -rotate-90 cursor-pointer'>
          <div className=' rounded-full p-2 bg-[#F3F9FB]' onClick={handleNext}>
            <Chevron className='size-6 text-[#008ECC]' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
