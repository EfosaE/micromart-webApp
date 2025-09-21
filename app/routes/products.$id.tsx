import { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';

export let handle = {
  breadcrumb: (data: { id: string | undefined }) => `Product: ${data.id}`,
};

export async function loader({ params }: LoaderFunctionArgs) {
  return { id: params.id }; // Example: params.id = '123'
}

const SingleProductPage = () => {
  const { id } = useLoaderData<typeof loader>();

  return (
    <div className='container'>
      <h1>Single Product Page</h1>
      <p>Product ID: {id}</p>
    </div>
  );
};

export default SingleProductPage;
