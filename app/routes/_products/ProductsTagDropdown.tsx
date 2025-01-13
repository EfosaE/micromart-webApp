import React, { useEffect, useRef, useState } from 'react';
import { Tag, TagsData } from '~/types';

interface TagProps {
  tagsData: TagsData;
  tags: Tag[]; // An array of strings for the tags
  setTags: React.Dispatch<React.SetStateAction<{ name: string; id: number }[]>>; // A setter function for updating the tags
}

export function ProductTagsDropdown({ tags, setTags, tagsData }: TagProps) {
  const [selectedTagType, setSelectedTagType] = useState<string | null>(null);
  const [isDropdown, setIsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSubDropdown, setIsSubDropdown] = useState(false);
  // Step 1: Create state to hold the input value
  const [otherTag, setOtherTag] = useState('');
  const TagTypes = Object.keys(tagsData).filter(
    (tagType) => tagType !== 'AdminTags'
  );
  // Handle changes to the input field with proper event typing
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherTag(event.target.value);
  };
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

  // Handle adding a tag
  const handleAddTag = ({ name, id }: Tag) => {
    // Prevent duplicates and ensure no more than 9 tags
    if (!tags.some((tag) => tag.name === name) && tags.length < 9) {
      setTags((prevTags) => [...prevTags, { name, id }]);
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagName: string) => {
    setTags((prevTags) => prevTags.filter((t) => t.name !== tagName));
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
            <p className='text-xs text-gray-500 '>
              You can only set 10 tags per product
            </p>
          </div>
        </div>
        {/* Selected Tags */}
        <div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {tags.map((tag) => (
              <span
                key={tag.name}
                className='flex items-center px-3 py-1 text-xs md:text-sm text-white bg-tertiary rounded-full cursor-pointer'
                onClick={() => handleRemoveTag(tag.name)}>
                {tag.name} <span className='ml-2 text-lg font-bold'>×</span>
              </span>
            ))}
          </div>
        </div>

        {/* Tags Display Dropdown*/}
        {isDropdown && (
          <div className='absolute text-sm md:text-base md:left-0 bg-white border border-gray-300 rounded-md shadow-lg w-56'>
            <ul className='py-1'>
              {TagTypes.map((tagType) => {
                return (
                  <li
                    key={tagType}
                    onClick={() => {
                      setSelectedTagType(tagType);
                      setIsSubDropdown(true);
                    }}
                    className={`cursor-pointer px-4 py-2 hover:bg-secondary hover:text-white ${
                      selectedTagType === tagType
                        ? 'bg-secondary text-white'
                        : ''
                    }`}>
                    {tagType}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Subtags Display Dropdown */}
        {isSubDropdown && selectedTagType && (
          <div className='absolute whitespace-nowrap mt-4 left-44 text-xs md:left-56 bg-white border border-gray-300 md:text-sm rounded-md shadow-lg h-48 overflow-auto w-48'>
            <ul className='mt-2 space-y-1 text-gray-700'>
              {tagsData[selectedTagType as keyof typeof tagsData]?.map(
                (subTag) => (
                  <li
                    key={subTag.id}
                    onClick={() =>
                      handleAddTag({ name: subTag.name, id: subTag.id })
                    }
                    className='px-2 py-1 rounded hover:bg-secondary hover:text-white cursor-pointer'>
                    {subTag.name}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTagsDropdown;
