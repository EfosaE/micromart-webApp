import { ActionFunctionArgs, data, LoaderFunctionArgs } from '@remix-run/node';
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
import { Button } from '~/components/Button';
import { REDIS_USER_TTL } from '~/utils/constants';
import { initializeRedis } from '~/services/redis.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const successMessage = url.searchParams.get('successMessage');
  return { successMessage };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const redirectTo = safeRedirect(formData.get('redirectTo')?.toString(), '/');
  // const client = await initializeRedis();
  try {
    // Use zod to validate the form data
    authSchemaWithoutName.parse({ email, password });
    if (email && password) {
      const result = await loginUser({ email, password });
      if (result.success && result.headers) {
        const token: string = result.data.accessToken;
        const user: User = result.data.user;

        // try {
        //   // store in redis
        //   await client.setEx(
        //     `user:${user.id}`,
        //     REDIS_USER_TTL,
        //     JSON.stringify(user)
        //   );
        // } catch (error) {
        //   console.log(error);
        // }

        // Redirect with the Set-Cookie header
        return createUserSession({
          request,
          token,
          redirectTo,
          user,
        });
      } else if (isErrorResponse(result)) {
        return data(
          { loginError: result.error },
          {
            status: result.statusCode,

            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }
  } catch (error) {
    // If validation fails, format the errors for the UI
    if (error instanceof ZodError) {
      const { fieldErrors } = error.flatten();
      console.log('fieldErrors', fieldErrors);
      return { errors: fieldErrors };
    }

    // Handle unexpected errors
    return data(
      { error: 'Something went wrong' },
      {
        status: 500,
      }
    );
  }
}

type ActionType = {
  loginError?: string | string[];
  errors?: {
    email?: string;
    password?: string;
  };
};

export default function LoginForm() {
  const loaderData = useLoaderData<{ successMessage?: string }>();
  const [password, setPassword] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData<ActionType>();
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
      <Button
        label={isSubmitting ? 'Logging in...' : 'Sign In'}
        type={'submit'}
        disabled={isSubmitting} styles={['w-full']}
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
