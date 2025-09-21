import { LoaderFunctionArgs, redirect } from 'react-router';
import { getUserProfile } from '~/services/api/auth.api';
import { createUserSession } from '~/services/session.server';
import { isErrorResponse, isSuccessResponse, User } from '~/types';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const accessToken = url.searchParams.get('token');
  let user: User;
  if (accessToken) {
    const response = await getUserProfile(accessToken);

    if (isSuccessResponse(response)) {
      console.log(response.data);
      user = response.data;
      return createUserSession({
        request,
        token: accessToken,
        redirectTo: '/',
        user,
      });
    }

    if (isErrorResponse(response)) {
      console.log(response.error);

      // Redirect to login with the encoded redirectTo query parameter
      throw redirect(`/login?redirectTo=`);
    }
  }

  // Redirect to login with the encoded redirectTo query parameter
  throw redirect(`/login?redirectTo=`);
}
