// app/components/Breadcrumbs.tsx
import { UIMatch, useMatches } from '@remix-run/react';
import { Fragment, HTMLAttributes } from 'react';

type BreadcrumbMatch = UIMatch<
  Record<string, unknown>,
  { breadcrumb: (data?: unknown) => string }
>;


export default function Breadcrumbs() {
  const matches = useMatches() as unknown as BreadcrumbMatch[];

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
    <nav aria-label='breadcrumb' className='container py-2'>
      <ol className='flex space-x-2'>
        {breadcrumbs.map((crumb, index) => (
          <li key={index}>
            <a href={crumb.href} className='text-blue-500 hover:underline'>
              {crumb.label}
            </a>
            {index < breadcrumbs.length - 1 && <span> / </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
