import { Link, useLoaderData, useMatches } from '@remix-run/react';
import { useEffect } from 'react';
import { fetchProducts } from '~/services/api/product.api';
import { initializeRedis } from '~/services/redis.server';
import { isErrorResponse, isSuccessResponse, Product } from '~/types';

export async function loader() {
  const client = await initializeRedis();
  const response = await fetchProducts(client);
  if (isSuccessResponse(response)) {
    return { products: response.data.products };
  }

  if (isErrorResponse(response)) {
    return { error: 'failed to load products' };
  }
}

type LoaderData = {
  products?: Product[];
  error?: string;
};

export default function Index() {
  const { products } = useLoaderData<LoaderData>();
  const matches = useMatches();

  // Find the parent route's data
  const layoutData = matches.find((match) => match.id === 'routes/_globalayout')
    ?.data as {
    user?: {
      id: string;
      name: string;
    };
  };

  const user = layoutData?.user;

  return (
    <div className='container'>
      <div
        className='md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 flex flex-col'>
        {products!.map((product) => {
          return (
            <div key={product.id}>
              <div className='md:h-40 h-64 overflow-clip'>
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  srcSet=''
                  className='w-full'
                />
              </div>
              <div className='bg-white p-2.5 flex flex-col gap-1 shadow-lg rounded-b-lg'>
                <Link
                  to={`/products/${product.id}`}
                  className='text-primary hover:text-secondary font-space'>
                  {product.name}
                </Link>
                <p className='text-slate-400 italic text-sm'>No reviews</p>
                <p>{product.price}</p>
              </div>
            </div>
          );
        })}
      </div>

      {user && <p className='text-primary'>Hello {user.name}</p>}
    </div>
  );
}
