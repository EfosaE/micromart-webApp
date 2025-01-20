import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { getCartInfo } from '~/services/session.server';
import { Product } from '~/types';
import CartDiv from './CartDiv';
import CartSummary from './CartSummary';

export let handle = {
  breadcrumb: () => 'Cart',
};
export async function loader({ request }: LoaderFunctionArgs) {
  const cart = await getCartInfo(request);
  //   console.log('from cart loader', cart);
  return { cart };
}

type LoaderData = {
  cart: Product[];
};
const Cart = () => {
  const { cart } = useLoaderData<LoaderData>();

  return (
    <main className='container'>
      <div className='flex gap-6 my-4 '>
        <CartDiv cart={cart} />
        <CartSummary cart={cart} />
      </div>
    </main>
  );
};

export default Cart;
