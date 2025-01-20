import { Button } from '~/components/Button';
import { Product } from '~/types';

const CartSummary = ({ cart }: { cart: Product[] }) => {
  return (
    <div className='w-1/4 p-2 bg-white h-fit'>
      <p className=' text-gray-700 font-semibold py-2 border-b border-slate-300'>
        Order Summary
      </p>
      <div className='flex justify-between py-2.5 border-b border-slate-300'>
        <p>Subtotal</p>
        <p className='font-semibold'>
          ₦{' '}
          {cart.reduce((total, item) => total + item.quantity * item.price, 0)}
        </p>
      </div>
      <Button label={'Proceed To Checkout'} styles={['my-1', 'reounded-sm', 'w-full']} />
    </div>
  );
};

export default CartSummary;
