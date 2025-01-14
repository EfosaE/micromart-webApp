import { useFetcher } from '@remix-run/react';
import { Product } from '~/types';

const CartDiv = ({ cart }: { cart: Product[] }) => {
  const fetcher = useFetcher();
  return (
    <div className=''>
      {cart && cart.length > 0 ? (
        cart.map((item) => {
          return (
            <fetcher.Form
              action='/resource/cart'
              method='post'
              className='md:grid md:grid-cols-2 lg:grid-cols-6 gap-6 flex flex-col my-4'
              key={item.id}>
              <input
                type='hidden'
                name='cartItem'
                value={JSON.stringify({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  imgUrl: item.imgUrl,
                })}
              />
              <div className='flex gap-2 items-center col-span-2'>
                <img
                  src={item.imgUrl}
                  alt={item.name}
                  sizes=''
                  srcSet=''
                  className='size-12 block'
                />
                <div>
                  <h4 className='font-semibold text-gray-600'>{item.name}</h4>
                </div>
              </div>

              <div className='flex items-center justify-around gap-1 py-0.5 px-1.5 shadow-md col-span-1'>
                <button
                  className='text-lg text-primary'
                  name='intent'
                  value='increment'>
                  +
                </button>
                <p>{item.quantity}</p>
                <button
                  className='text-lg text-red-500'
                  name='intent'
                  value='decrement'>
                  -
                </button>
              </div>

              <div className='flex gap-2 items-center justify-center col-span-2 font-semibold text-gray-600'>
                <p>₦ {item.price}</p>
              </div>

              <div className='flex flex-col items-center justify-center col-span-1'>
                <button
                  className='text-red-400 text-xs'
                  name='intent'
                  value='remove'>
                  Remove Item
                </button>
                <button
                  className='text-secondary text-xs'
                  name='intent'
                  value='save'>
                  Save For Later
                </button>
              </div>
            </fetcher.Form>
          );
        })
      ) : (
        <p>No Cart Items</p>
      )}
    </div>
  );
};

export default CartDiv;
