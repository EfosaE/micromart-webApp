import { Field, Label, Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import CheckIcon from "~/components/icons/CheckIcon";
import { sortBy } from "~/data";

interface CategoryHeaderProps {
  name: string;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ name }) => {
  return (
    <form method='get' className='bg-white'>
      <div className='container flex justify-between items-center pb-2'>
        <p className='capitalize'>{name}</p>
        <Field className='flex gap-1 items-center text-sm'>
          <Label>Sort By:</Label>
          <Listbox name='sortBy' defaultValue={sortBy[0]}>
            <ListboxButton className=' rounded data-[open]:text-primary text-xs data-[open]:ring-1 data-[open]:outline-none data-[open]:ring-secondary data-[open]:border-secondary border p-2.5 border-gray-500'>
              {({ value }) => value.name}
            </ListboxButton>

            <ListboxOptions
              anchor='bottom start'
              className='mt-1 h-48 overflow-auto bg-gray-200 w-48 rounded'>
              {sortBy.map((sortBy: { name: string; id: number }) => (
                <ListboxOption
                  key={sortBy.id}
                  value={sortBy}
                  className='group flex gap-1 text-sm p-2.5 bg-gray-200 data-[focus]:bg-blue-100 cursor-pointer my-1'>
                  <CheckIcon className='invisible size-5 group-data-[selected]:visible text-secondary self-start' />
                  <p className='self-center'>{sortBy.name}</p>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </Field>
      </div>
    </form>
  );
};

export default CategoryHeader