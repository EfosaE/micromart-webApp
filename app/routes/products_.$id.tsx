import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ params }: LoaderFunctionArgs) {
  console.log(params);
  return params.id;
}

const SingleProductPage = () => {
  const id = useLoaderData<typeof loader>();
  return <div className='container'>SingleProductPage: {id}</div>;
};

export default SingleProductPage;
