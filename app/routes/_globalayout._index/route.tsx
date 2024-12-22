import { useMatches } from '@remix-run/react';

export default function Index() {
  const matches = useMatches();

  // Find the parent route's data
  const layoutData = matches.find((match) => match.id === 'routes/_globalayout')
    ?.data as {
    user?: {
      id: string;
      name: string;
    };
  };

  const user = layoutData?.user;

  return (
    <div className='text-3xl font-bold underline'>
      {user && <h1 className='text-green-400'>Hello {user.name}</h1>}
    </div>
  );
}
