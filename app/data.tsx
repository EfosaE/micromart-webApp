import Heart from "./components/icons/Heart";
import Inbox from "./components/icons/Inbox";
import Orders from "./components/icons/Orders";
import Reviews from "./components/icons/Reviews";
import Store from "./components/icons/Store";
import Voucher from "./components/icons/Voucher";

  export const CategoryBasedTags = [
    'Clothing',
    'Shoes & Footwear',
    'Bags',
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Toys & Games',
    'Books',
    'Computers & Accessories',
    'Phones & Accessories',
    'Health & Wellness',
    'Groceries',
    'Automotive',
    'Office Supplies',
    'Jewelry & Accessories',
    'Appliances',
    'Furniture',
    'Pet Supplies',
    'Services',
    'Tools',
  ];
export const dropDownLinks = [
  {
    name: 'Orders',
    icon: <Orders className='size-6 mr-2' />,
    to: '/account/orders',
  },
  {
    name: 'Inbox',
    icon: <Inbox className='size-6 mr-2' />,
    to: '/account/inbox',
  },
  {
    name: 'Vouchers',
    icon: <Voucher className='size-6 mr-2' />,
    to: '/account/vouchers',
  },
  {
    name: 'Pending Reviews',
    icon: <Reviews className='size-6 mr-2' />,
    to: '/orders',
  },
  {
    name: 'Saved Products',
    icon: <Heart className='size-6 mr-2' />,
    to: '/account/favorites',
  },
  {
    name: 'Followed Vendors',
    icon: <Store className='size-6 mr-2' />,
    to: 'account/followed-vendors',
  },
];