import { CategoryBasedTags } from '~/data';

const Tags = () => {
  return (
    <div>
      <div className='bg-slate-100 h-[1px] w-full'></div>
      <div className='flex overflow-x-auto space-x-2 container my-2'>
        {CategoryBasedTags.map((tag) => (
          <div className='flex space-x-2' key={tag}>
            <p
              key={tag}
              className={`whitespace-nowrap cursor-pointer px-3 py-1 rounded-full text-sm  bg-tertiary bg-opacity-20 text-gray-700 hover:bg-opacity-100`}>
              {tag}
            </p>
          </div>
        ))}
      </div>
      <div className='bg-slate-100 h-[1px] w-full'></div>
    </div>
  );
};

export default Tags;
