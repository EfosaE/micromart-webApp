import { data, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { getProducts } from '~/services/api/product.api';
import { isSuccessResponse, isErrorResponse } from '~/types';

export const meta: MetaFunction = () => [{ title: 'Products' }]; // this causes remix to behave a weird way in dev

export async function loader() {
  const response = await getProducts();

  // Check if the response is successful and store in cache
  if (isSuccessResponse(response)) {
    const products: Product[] = response.data.products;
    console.log('products', products);

    return { products }
  }

  // If the response is an error, return null
  if (isErrorResponse(response)) {
    return { error: response.error };
  }
}
type Product = {
  id: string;
  name: string;
};

type LoaderData = {
  products: Product[];
  error: string[] | string;
};

const Products = () => {
  const { products, error } = useLoaderData<LoaderData>();
  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <div>
      <ul>
        {products &&
          products.map((product) => <li key={product.id}>{product.name}</li>)}
      </ul>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
};

export default Products;
