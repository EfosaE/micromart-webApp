import { Link, useLoaderData, useMatches } from '@remix-run/react';
import { useEffect } from 'react';
import Appliances from '~/components/CategoriesUi/Appliances';
import Computers from '~/components/CategoriesUi/Computers';
import Phones from '~/components/CategoriesUi/Phones';
import Hero from '~/components/Hero';
import Chevron from '~/components/icons/Chevron';
import { fetchProducts } from '~/services/api/product.api';
import { initializeRedis } from '~/services/redis.server';
import { isErrorResponse, isSuccessResponse, Product } from '~/types';

export async function loader() {
  const client = await initializeRedis();
  const response = await fetchProducts(client);

  if (isSuccessResponse(response)) {
    return response.data;
  }

  if (isErrorResponse(response)) {
    return { error: 'failed to load products' };
  }
}

type LoaderData = {
  phones?: Product[];
  computers?: Product[];
  appliances?: Product[];
  error?: string;
};

export default function Index() {
  const { phones, computers, appliances, error } = useLoaderData<LoaderData>();
  const matches = useMatches();

  useEffect(() => {
    console.log(phones, computers, appliances);
    console.log(error);
  }, [phones, computers, appliances, error]);

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
      <Hero />

      <div className='flex flex-col space-y-14 mt-8'>
        <Phones phones={phones} error={error} />
        <Computers computers={computers} error={error} />
        <Appliances appliances={appliances} error={error} />
      </div>
    </div>
  );
}
