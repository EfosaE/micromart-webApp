import {
  ActionFunctionArgs,
  createCookie,
  LoaderFunctionArgs,
} from '@remix-run/node';
import {
  useActionData,
  Form,
  useSearchParams,
  useNavigation,
  useLoaderData,
} from '@remix-run/react';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';

import { Input } from '~/components/Input';
import { loginUser } from '~/services/api/auth.api';
import { safeRedirect } from '~/utils/safeRedirect';
import { authSchemaWithoutName } from '~/utils/validation';
import { parseCookie } from '~/utils/cookieUtils';
import { createAuthCookie } from '~/services/cookies.server';
import { createUserSession } from '~/services/session.server';
import { isErrorResponse, User } from '~/types';
import { AuthButton } from '~/components/Button';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const successMessage = url.searchParams.get('successMessage');
  return new Response(
    JSON.stringify({ successMessage }), // Serialize success message into the body
    {
      status: 200, // HTTP status
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const redirectTo = safeRedirect(formData.get('redirectTo')?.toString(), '/');

  try {
    // Use zod to validate the form data
    authSchemaWithoutName.parse({ email, password });
    if (email && password) {

      const result = await loginUser({ email, password });
      if (result.success && result.headers) {
        const token: string = result.data.accessToken;
        const user: User = result.data.user;
        const setCookieHeader = result.headers['set-cookie'];
        // convert to object
        if (setCookieHeader) {
          const parsedCookie = parseCookie(setCookieHeader[0]);
          const authCookie = await createAuthCookie(
            parsedCookie.name,
            parsedCookie.value,
            parsedCookie.settings
          );
          console.log('redirectUrl from login:', redirectTo);
          // Redirect with the Set-Cookie header
          return createUserSession({
            request,
            token,
            redirectTo,
            authCookie,
            user,
          });
        } // else (no-cookies are sent with the response),
      } else if (isErrorResponse(result)) {
        // Failure: Return the error message to be displayed on the client
        return new Response(JSON.stringify({ loginError: result.error }), {
          status: result.statusCode,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  } catch (error) {
    // If validation fails, format the errors for the UI
    if (error instanceof ZodError) {
      const { fieldErrors } = error.flatten();
      console.log('fieldErrors', fieldErrors);
      return new Response(JSON.stringify({ errors: fieldErrors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Handle unexpected errors
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export default function LoginForm() {
  const loaderData = useLoaderData<{ successMessage?: string }>();
  const [password, setPassword] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/';
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (loaderData.successMessage) {
      enqueueSnackbar(loaderData.successMessage, {
        variant: 'success',
        preventDuplicate: true,
      });
    }
  }, [loaderData]);

  useEffect(() => {
    if (actionData?.loginError) {
      if (Array.isArray(actionData.loginError)) {
        actionData.loginError.forEach((error: string) => {
          enqueueSnackbar(error, { variant: 'error' });
        });
      } else {
        enqueueSnackbar(actionData.loginError, { variant: 'error' });
      }
    }
  }, [actionData]);

  return (
    <Form method='post' className='space-y-6 w-full'>
      <Input name={'email'} label={'email'} error={actionData?.errors?.email} />
      <Input
        label={'password'}
        name={'password'}
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={actionData?.errors?.password}
        autoComplete='current-password' // Allow autofill suggestion for new password
        togglePasswordVisibility={togglePasswordVisibility}
        showPassword={showPassword}
      />

      <input type='hidden' name='redirectTo' value={redirectTo} />
      <AuthButton
        label={isSubmitting ? 'Logging in...' : 'Sign In'}
        type={'submit'}
        disabled={isSubmitting}
      />
    </Form>
  );
}

//     if setting multiple cookies
// if (setCookieHeader) {
//   // convert to array of objects
//   const parsedCookies = parseSetCookieHeader(setCookieHeader);
//   console.log(parsedCookies);

//   // Serialize cookies
//   const remixCookies = parsedCookies.map((cookie) => {
//     const { name, value, settings } = cookie;
//     return createRemixCookie(name, value, settings);
//   });
//   console.log('remix-cookies', remixCookies);
//   const resolvedCookies = await Promise.all(remixCookies);
//   // Create headers and set each cookie individually
//   const headers = new Headers();
//   resolvedCookies.forEach((cookie) => {
//     console.log(cookie);
//     headers.append('Set-Cookie', cookie); // Append each cookie separately
//   });
// }
