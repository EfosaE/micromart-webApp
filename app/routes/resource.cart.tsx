import { data, LoaderFunctionArgs } from '@remix-run/node';
import { cartCookie } from '~/services/cookies.server';
import { getCartInfo } from '~/services/session.server';
import { Product } from '~/types';

export const action = async ({ request }: { request: Request }) => {
  const cartData: Product[] = await getCartInfo(request);
  const formData = await request.formData();
  const intent = formData.get('intent') as string;
  console.log('Intent:', intent);

  const cartItem: Product = JSON.parse(formData.get('cartItem') as string);
  console.log('Cart Item:', cartItem); // {id: "12345", quantity: 2}

  let updatedCart: Product[] = cartData || [];

  switch (intent) {
    case 'increment':
      updatedCart = updatedCart.map((item) =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      console.log('Quantity Increased:', updatedCart);
      break;

    case 'decrement':
      updatedCart = updatedCart.map((item) =>
        item.id === cartItem.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      console.log('Quantity Decreased:', updatedCart);
      break;
    case 'remove':
      updatedCart = updatedCart.filter((item) => item.id !== cartItem.id);
      console.log('Item Removed:', updatedCart);
      break;
    case 'save':
      return  updatedCart;
    default:
      // Add new item or update quantity
      const existingItem = updatedCart.find((item) => item.id === cartItem.id);

      if (existingItem) {
        updatedCart = updatedCart.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        );
        console.log('Updated Quantity:', updatedCart);
      } else {
        updatedCart.push(cartItem);
        console.log('Added New Item:', cartItem);
      }
      break;
  }

  return data(
    { success: true },
    {
      headers: {
        'Set-Cookie': await cartCookie.serialize(updatedCart),
      },
    }
  );
};
