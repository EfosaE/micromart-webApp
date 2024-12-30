

// const Footer = () => {
//   return (
//     <footer className='bg-secondary py-4'>
//       <div className='container text-white'>
//         <div className=''>
//           <h2 className='font-semibold text-2xl'>MicroMart</h2>
//           <div className="text-sm flex flex-col">
//             <Link to={'/contact'}>Contact Us</Link>
//             <Link to={'/contact'}>About</Link>
//           </div>
//         </div>
//         <div className=''></div>
//         <div className=''></div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


const Footer = () => {
  return (
    <footer className='bg-secondary font-space text-white py-10'>
      <div className='container'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {/* About Section */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>About MicroMart</h3>
            <p className='text-sm text-slate-200 text-xs md:text-sm'>
              Your Company is a leading e-commerce platform offering a wide
              range of products with the best deals and reliable customer
              support.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Customer Service</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-slate-200 text-xs md:text-sm hover:text-white transition'>
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-200 text-xs md:text-sm hover:text-white transition'>
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-200 text-xs md:text-sm hover:text-white transition'>
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-200 text-xs md:text-sm hover:text-white transition'>
                  Track Your Order
                </a>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Shop Categories</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-slate-200 text-xs md:text-sm hover:text-white transition'>
                  Electronics
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-200 text-xs md:text-sm hover:text-white transition'>
                  Fashion
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-200 text-xs md:text-sm hover:text-white transition'>
                  Home & Living
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-200 text-xs md:text-sm hover:text-white transition'>
                  Beauty & Health
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Connect with Us</h3>
            <p className='text-sm text-slate-200 text-xs md:text-sm mb-4'>
              Subscribe to our newsletter for exclusive deals and updates.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='border-t border-slate-200 mt-10 pt-6 text-sm text-slate-100  text-xs md:text-sm text-center container px-12 '>
          <p>
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
          <div className='flex justify-center space-x-4 mt-4'>
            <a href='#' className='hover:text-white transition'>
              Privacy Policy
            </a>
            <a href='#' className='hover:text-white transition'>
              Terms of Service
            </a>
            <a href='#' className='hover:text-white transition'>
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
