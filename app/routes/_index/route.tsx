import { useMatches } from '@remix-run/react';
import Tags from '~/components/Tags';

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
    <div className=''>
      <Tags />
      <h3>Landing Page</h3>

      {user && <p className='text-primary'>Hello {user.name}</p>}
    </div>
  );
}
