import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { getCartInfo } from '~/services/session.server';
import { Product } from '~/types';
import CartDiv from './CartDiv';

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
  const [totalPrice, setTotalPrice] = useState();
  const { cart } = useLoaderData<LoaderData>();

  return (
    <main className='container bg-white my-4 pb-6'>
      <div className='text-xl font-bold py-2 border-b border-slate-300'>
        Cart Items
      </div>
      <CartDiv cart={cart}/>
    </main>
  );
};

export default Cart;
