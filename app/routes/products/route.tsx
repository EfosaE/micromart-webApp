import { Outlet} from '@remix-run/react';


export let handle = {
  breadcrumb: () => 'Products',
};

const Products = () => {
  return (
    <div className='container'>
      <Outlet />
    </div>
  );
};

export default Products;
