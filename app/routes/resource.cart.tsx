import { data, LoaderFunctionArgs } from '@remix-run/node';
import { cartCookie } from '~/services/cookies.server';
import { getCartInfo } from '~/services/session.server';
import { CartItem } from '~/types';

export const action = async ({ request }: { request: Request }) => {
  const cartData: CartItem[] = await getCartInfo(request);
  const formData = await request.formData();
  const intent = formData.get('intent') as string;
  console.log('Intent:', intent);

  const cartItem: CartItem = JSON.parse(formData.get('cartItem') as string);
  console.log('Cart Item:', cartItem); // {id: "12345", cartQuantity: 2}

  let updatedCart: CartItem[] = cartData || [];

  switch (intent) {
    case 'increment':
      updatedCart = updatedCart.map((item) =>
        item.id === cartItem.id
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      );
      console.log('cartQuantity Increased:', updatedCart);
      break;

    case 'decrement':
      updatedCart = updatedCart.map((item) =>
        item.id === cartItem.id && item.cartQuantity > 1
          ? { ...item, cartQuantity: item.cartQuantity - 1 }
          : item
      );
      console.log('cartQuantity Decreased:', updatedCart);
      break;
    case 'remove':
      updatedCart = updatedCart.filter((item) => item.id !== cartItem.id);
      console.log('Item Removed:', updatedCart);
      break;
    case 'save':
      return  updatedCart;
    default:
      // Add new item or update cartQuantity
      const existingItem = updatedCart.find((item) => item.id === cartItem.id);

      if (existingItem) {
        updatedCart = updatedCart.map((item) =>
          item.id === cartItem.id
            ? { ...item, cartQuantity: item.cartQuantity + cartItem.cartQuantity }
            : item
        );
        console.log('Updated cartQuantity:', updatedCart);
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
