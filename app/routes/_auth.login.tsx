import { ActionFunctionArgs, createCookie } from '@remix-run/node';
import {
  useActionData,
  Form,
  useSearchParams,
  useNavigation,
} from '@remix-run/react';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { loginUser } from '~/services/api/auth.api';
import { safeRedirect } from '~/utils/safeRedirect';
import { authSchemaWithoutName } from '~/utils/validation';
import { parseCookie } from '~/utils/cookieUtils';
import { createAuthCookie } from '~/services/cookies.server';
import { createUserSession } from '~/services/session.server';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const redirectTo = safeRedirect(formData.get('redirectTo')?.toString(), '/');
  console.log('redirectUrl:', redirectTo);

  try {
    // Use zod to validate the form data
    authSchemaWithoutName.parse({ email, password });
    if (email && password) {
      // call your signIn endpoint

      const result = await loginUser({ email, password });
      if (result.success && result.headers) {
        const token: string = result.data.accessToken;
        const setCookieHeader = result.headers['set-cookie'];
        // convert to object
        if (setCookieHeader) {
          const parsedCookie = parseCookie(setCookieHeader[0]);
          const authCookie = await createAuthCookie(
            parsedCookie.name,
            parsedCookie.value,
            parsedCookie.settings
          );
          // Redirect with the Set-Cookie header
          return createUserSession({
            request,
            token,
            redirectTo,
            authCookie,
          });
        } // else
      } else if (!result.success) {
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
