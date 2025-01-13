import { data, LoaderFunctionArgs } from '@remix-run/node';
import { cartCookie } from '~/services/cookies.server';
import { Cart } from '~/types';

export const action = async ({ request }: { request: Request }) => {
  console.log('action called!')
  const formData = await request.formData();
  const cartItem:Cart = JSON.parse(formData.get('cartItem') as string);

  console.log('Cart Item:', cartItem); // { productId: "12345", quantity: 2 }

  return data(
    { success: true },
    { headers: { 'Set-Cookie': await cartCookie.serialize([cartItem]) } }
  );
};


export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cart = (await cartCookie.parse(cookieHeader)) || [];
  console.log('from cart loader',cart);
    return { cart };
}
