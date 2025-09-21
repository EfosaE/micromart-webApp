import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react';
import CheckIcon from './icons/CheckIcon';
import { Await } from 'react-router';
import { Suspense, useEffect, useState } from 'react';

export interface Category {
  name: string;
  id: number;
}
// Categories Component
interface CategoriesProps {
  categoriesPromise: Promise<Category[]>;
}

const Categories: React.FC<CategoriesProps> = ({ categoriesPromise }) => {
  const [hydrated, setHydrated] = useState(false);

  // Track when hydration completes
  useEffect(() => {
    console.log(hydrated);
    setHydrated(true);
  }, [hydrated]);
  return (
    <Field className='flex flex-col'>
      <Label>Category</Label>
      <Listbox name='categoryName'>
        <ListboxButton className=' rounded data-[open]:ring-1 data-[open]:outline-none data-[open]:ring-secondary data-[open]:border-secondary border p-2.5 border-gray-500'>
          {
            ({ value }) => (value ? value.name : 'Select a category...') // Fallback text for undefined value
          }
        </ListboxButton>
        {hydrated && (
          <Suspense fallback='Loading categories...'>
            <Await
              resolve={categoriesPromise as unknown as Category[]}
              errorElement={
                <p className='text-red-500'>Failed to load categories.</p>
              }>
              {(categories) => (
                <ListboxOptions
                  anchor='bottom start'
                  className='mt-1 h-48 overflow-auto bg-white p-2.5 w-fit rounded'>
                  {categories.map((category: { name: string; id: number }) => (
                    <ListboxOption
                      key={category.id}
                      value={category}
                      className='group flex gap-1 text-sm p-1 bg-white data-[focus]:bg-blue-100 cursor-pointer my-1'>
                      <CheckIcon className='invisible size-5 group-data-[selected]:visible text-secondary' />
                      {category.name}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              )}
            </Await>
          </Suspense>
        )}
      </Listbox>
    </Field>
  );
};

export default Categories;
