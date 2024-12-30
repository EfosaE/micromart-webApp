import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { logout } from '~/services/session.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log('logout called!!!')
  const currentUrl = new URL(request.url); // Get the current URL
  const redirectTo = currentUrl.pathname + currentUrl.search; // Preserve the path and query parameters
   throw await  logout(request);
};
export const loader = async () => redirect('/login');
