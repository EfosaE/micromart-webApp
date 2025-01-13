import { LoaderFunctionArgs } from '@remix-run/node';
import { useSearchParams, Form } from '@remix-run/react';
import { Button } from '~/components/Button';
import SearchIcon from '~/components/icons/SearchIcon';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    console.log(query)
  // Perform server-side actions if needed (e.g., search the database)
  return { query };
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className='container'>
      <Form method='get' className='flex'>
        <input
          type='text'
          name='q'
          defaultValue={query}
          className='bg-tertiary bg-opacity-10 py-2 px-10 focus:border rounded-md w-full  focus:border-secondary focus:outline-none  focus:ring-2 focus:ring-purple-500 placeholder:text-sm placeholder:text-gray-500'
          placeholder='Search for products, categories, etc.'
          autoFocus
        />
        <Button label={<SearchIcon className='size-6' />} styles={['w-fit']}/>
      </Form>

      {/* Optionally render search results */}
      {query && (
        <div className='results'>
          <p>
            Showing results for: <strong>{query}</strong>
          </p>
          {/* Replace with real search results */}
        </div>
      )}
    </div>
  );
}
