// app/components/Breadcrumbs.tsx
import { UIMatch, useLocation, useMatches } from '@remix-run/react';
import Chevron from './icons/Chevron';

type BreadcrumbMatch = UIMatch<
  Record<string, unknown>,
  { breadcrumb: (data?: unknown) => string }
>;

export default function Breadcrumbs() {
  const matches = useMatches() as unknown as BreadcrumbMatch[];
  const location = useLocation();

  const breadcrumbs = matches
    .filter((match) => typeof match.handle?.breadcrumb === 'function') // Type guard ensures only matches with a breadcrumb function are considered
    .map((match) => {
      const data = match.data || {}; // Use loader data or default to an empty object
      return {
        label: match.handle!.breadcrumb(data), // `handle` is safe due to type guard
        href: match.pathname,
      };
    });

  return (
    <nav aria-label='breadcrumb' className='bg-white'>
      <ol className='container py-2 flex'>
        {location.pathname !== '/' &&
          breadcrumbs.map((crumb, index) => (
            <li key={index} className='flex'>
              <a
                href={crumb.href}
                className={`text-xs hover:underline ${
                  index === breadcrumbs.length - 1
                    ? 'text-gray-600 pointer-events-none'
                    : 'text-blue-500 '
                }`}>
                {crumb.label}
              </a>
              {index < breadcrumbs.length - 1 && (
                <Chevron className='size-4 -rotate-90' />
              )}
            </li>
          ))}
      </ol>
    </nav>
  );
}
