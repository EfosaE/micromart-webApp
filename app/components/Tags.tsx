import { ProductTags, productTags } from '~/data';

const Tags = () => {
  return (
    <div className='flex overflow-x-auto space-x-2'>
      {Object.entries(productTags)
        .filter(
          ([category]) =>
            category === 'GeneralProductTags' ||
            category === 'CategoryBasedTags'
        ) // Only show specific categories
        .map(([category, tags]) => (
          <div className='flex space-x-2'  key={category}>
            {(tags as ProductTags[keyof ProductTags]).map((tag) => (
              <p
                key={tag}
                className={`whitespace-nowrap cursor-pointer px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300`}>
                {tag}
              </p>
            ))}
          </div>
        ))}
    </div>
  );
};

export default Tags;

// const Tags = () => {
//   return (
//     <div className='p-4'>
//       {Object.entries(productTags).map(([category, tags]) => (
//         <div key={category} className='mb-6'>
//           <h3 className='text-lg font-semibold'>
//             {category.replace(/([A-Z])/g, ' $1')}
//           </h3>
//           <ul className='list-disc pl-6'>
//             {(tags as ProductTags[keyof ProductTags]).map((tag) => (
//               <li key={tag} className='text-gray-700'>
//                 {tag}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Tags;
