import React, { useEffect, useRef, useState } from 'react';
import { productTags, TagTypes } from '~/data';

interface TagProps {
  tags: string[]; // An array of strings for the tags
  setTags: React.Dispatch<React.SetStateAction<string[]>>; // A setter function for updating the tags
}

export function ProductTagsDropdown({ tags, setTags }: TagProps) {
  const [selectedTagType, setSelectedTagType] = useState<TagTypes | null>(null);
  const [isDropdown, setIsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSubDropdown, setIsSubDropdown] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdown(false);
        setIsSubDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = (tag: string) => {
    // Prevent duplicates
    if (!tags.includes(tag) && tags.length <= 9) {
      setTags((prevTags) => [...prevTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  };
  return (
    <div className='flex'>
      <div className='relative' ref={dropdownRef}>
        <div className='flex flex-col md:flex-row md:items-center gap-2'>
          <p>Tags</p>

          <div className='flex items-center gap-1'>
            <button
              type='button'
              className=' w-fit px-2 py-1 text-sm font-medium  border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2'
              onClick={() => {
                // setSelectedTagType(null);
                setIsDropdown(!isDropdown);
              }}>
              Add Tags
            </button>
            <p className='text-xs text-gray-500 '>You can only set 10 tags per product</p>
          </div>
        </div>
        {/* Selected Tags */}
        <div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='flex items-center px-3 py-1 text-xs md:text-sm text-white bg-tertiary rounded-full cursor-pointer'
                onClick={() => handleRemoveTag(tag)}>
                {tag} <span className='ml-2 text-lg font-bold'>×</span>
              </span>
            ))}
          </div>
        </div>

        {/* Tags Display Dropdown*/}
        {isDropdown && (
          <div className='absolute text-sm md:text-base md:left-0 bg-white border border-gray-300 rounded-md shadow-lg w-56'>
            <ul className='py-1'>
              {Object.values(TagTypes).map((tagType) => (
                <li
                  key={tagType}
                  onClick={() => {
                    setSelectedTagType(tagType);
                    setIsSubDropdown(true);
                  }}
                  className={`cursor-pointer px-4 py-2 hover:bg-secondary hover:text-white ${
                    selectedTagType === tagType && 'bg-secondary text-white'
                  }`}>
                  {tagType}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Subtags Display Dropdown */}
        {isSubDropdown && selectedTagType && (
          <div className='absolute whitespace-nowrap mt-4 left-44 text-xs md:left-56 bg-white border border-gray-300 md:text-sm rounded-md shadow-lg h-48 overflow-auto'>
            <ul className='mt-2 space-y-1 text-gray-700'>
              {productTags[selectedTagType].map((subTag) => (
                <li
                  key={subTag}
                  onClick={() => handleAddTag(subTag)}
                  className='px-2 py-1 rounded hover:bg-secondary hover:text-white cursor-pointer'>
                  {subTag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTagsDropdown;