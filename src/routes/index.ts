import RootLayout from '../components/layout/RootLayout';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import Products from '../pages/Products';

export default [
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: '/contact',
        Component: Contact,
      },
      {
        path: '/products',
        Component: Products,
        // loader: ({ request, params }) =>
        //   fetch(`/api/show/${params.id}.json`, {
        //     signal: request.signal,
        //   }),
      },
    ],
  },
];
