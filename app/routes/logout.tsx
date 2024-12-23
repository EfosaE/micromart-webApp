import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { logout } from '~/services/session.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const currentUrl = new URL(request.url); // Get the current URL
  const redirectTo = currentUrl.pathname + currentUrl.search; // Preserve the path and query parameters
  logout(request, redirectTo);
};
export const loader = async () => redirect('/login');
