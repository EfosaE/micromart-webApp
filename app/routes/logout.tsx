import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { logout } from '~/services/session.server';

export const action = async ({ request }: ActionFunctionArgs) =>
  logout(request);

export const loader = async () => redirect('/login');
