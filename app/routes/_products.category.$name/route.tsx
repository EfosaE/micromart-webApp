import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react';
import { data, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { Button } from '~/components/Button';
import { getProducts } from '~/services/api/product.api';
import { isSuccessResponse, isErrorResponse, Product } from '~/types';
import { capitalizeWord } from '~/utils';
import CategoryHeader from './CategoryHeader';
import { SnackbarKey, closeSnackbar, enqueueSnackbar } from 'notistack';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.name) {
    return [{ title: 'Default Title' }];
  }

  return [{ title: `Buy your ${capitalizeWord(data.name)}` }];
};

export let handle = {
  breadcrumb: (data: { name: string }) => {
    return `${capitalizeWord(data.name)}`; // Properly return the formatted string
  },
};

export async function loader({ params }: LoaderFunctionArgs) {
  const categoryName = params.name;

  const products = await getProducts(categoryName || '');
  if (products) {
    return { products, name: categoryName };
  }

  return { error: 'Failed to get Prodcuts', name: categoryName };
}

type LoaderData = {
  name: string;
  products: Product[];
  error: string[] | string;
};

const Products = () => {
  const { products, error, name } = useLoaderData<LoaderData>();

  return (
    <div>
      <CategoryHeader name={name} />

      <div className='md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 flex flex-col container my-4'>
        {products &&
          products.map((product) => {
            const fetcher = useFetcher<{ success: boolean }>();
            const isSubmitting = fetcher.state === 'submitting';
            useEffect(() => {
              console.log(fetcher.data);
              const action = (snackbarId: SnackbarKey | undefined) => (
                <div className='flex gap-2 text-xs'>
                  <Link
                    to={'/cart'}
                    onClick={() => {
                      closeSnackbar(snackbarId);
                    }}>
                    View Cart
                  </Link>
                  <button
                    onClick={() => {
                      closeSnackbar(snackbarId);
                    }}>
                    Dismiss
                  </button>
                </div>
              );
              if (fetcher.data?.success) {
                enqueueSnackbar(`${product.name} added to cart!`, {
                  variant: 'success',
                  action,
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                });
              }
              if (fetcher.data && !fetcher.data.success) {
                enqueueSnackbar(`Failed to add ${product.name} to cart.`, {
                  variant: 'error',
                  action,
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                });
              }
            }, [fetcher.data, product.name]);

            return (
              <div key={product.id} className='hover:shadow-2xl group'>
                <div
                  className='h-64 overflow-clip flex items-center bg-cover bg-center'
                  style={{ backgroundImage: `url(${product.imgUrl})` }}>
                  {/* Content goes here */}
                </div>
                <div className='bg-white px-2.5 py-4 flex flex-col justify-between gap-1 rounded-b-lg '>
                  <div>
                    <Link
                      to={`${product.id}`}
                      className='text-primary hover:text-secondary font-space'>
                      {product.name}
                    </Link>
                    <p className='text-slate-400 italic text-sm'>No reviews</p>
                    <p className='text-sm'>₦ {product.price}</p>
                  </div>
                  <fetcher.Form method='post' action='/resource/cart'>
                    <input
                      type='hidden'
                      name='cartItem'
                      value={JSON.stringify({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        imgUrl: product.imgUrl
                      })}
                    />
                    <Button
                      label={isSubmitting ? 'Adding...' : 'Add to cart'}
                      styles={['w-full']}
                      disabled={isSubmitting}
                    />
                  </fetcher.Form>
                </div>
              </div>
            );
          })}
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
};

export default Products;
