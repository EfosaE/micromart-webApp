import { ProductTags, productTags } from '~/data';

const Tags = () => {
  return (
    <div className='flex overflow-x-auto space-x-2 container'>
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
