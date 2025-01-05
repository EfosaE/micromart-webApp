import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import { data, redirect } from '@remix-run/node';
import { Input } from '~/components/Input';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { authSchema } from '~/utils/validation';
import { ZodError } from 'zod';
import { useEffect, useState } from 'react';
import { safeRedirect } from '~/utils/safeRedirect';
import { signUpUser } from '~/services/api/auth.api';
import { useSnackbar } from 'notistack';
import { isErrorResponse } from '~/types';
import { AuthButton } from '~/components/Button';

export const meta: MetaFunction = () => [{ title: 'Sign Up' }];

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const redirectTo = safeRedirect(formData.get('redirectTo')?.toString(), '/');
  console.log('redirectUrl:', redirectTo);

  try {
    // Use zod to validate the form data
    authSchema.parse({ name, email, password });
    if (name && email && password) {
      // call your signIn endpoint
      const result = await signUpUser({ name, email, password });
      console.log(result);
      if (result.success) {
        const successMessage = encodeURIComponent(
          'Sign up successful! Please log in.'
        );
        return redirect(
          `/login?redirectTo=${encodeURIComponent(
            redirectTo
          )}&successMessage=${successMessage}`
        );
      } else if (isErrorResponse(result)) {
        console.log(result);
        // Handle unexpected errors
        return data(
          { signUpError: result.error },
          {
            status: result.statusCode,
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
  signUpError?: string | string[];
  errors?: {
    name?: string;
    email?: string;
    password?: string;
  };
};

export default function Register() {
  const [password, setPassword] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData<ActionType>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/';
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (actionData?.signUpError) {
      if (Array.isArray(actionData.signUpError)) {
        actionData.signUpError.forEach((error: string) => {
          enqueueSnackbar(error, { variant: 'error' });
        });
      } else {
        enqueueSnackbar(actionData.signUpError, { variant: 'error' });
      }
    }
  }, [actionData]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <Form method='post' className='space-y-2 w-full'>
      <Input name={'name'} label={'name'} error={actionData?.errors?.name} />
      <Input name={'email'} label={'email'} error={actionData?.errors?.email} />
      <div className='relative'>
        <Input
          label={'password'}
          name={'password'}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={actionData?.errors?.password}
          autoComplete='new-password' // Allow autofill suggestion for new password
          togglePasswordVisibility={togglePasswordVisibility}
          showPassword={showPassword}
        />
      </div>

      <input type='hidden' name='redirectTo' value={redirectTo} />
      <AuthButton
        label={isSubmitting ? 'Please Wait...' : 'Sign Up'}
        type={'submit'}
        disabled={isSubmitting}
      />

      <div className='flex items-center'>
        <div className='bg-slate-400 h-[1px] flex-1'></div>
        <Link
          to={'/register/vendor'}
          className='text-secondary mx-8 text-sm'
          prefetch='viewport'>
          Register as a vendor
        </Link>
        <div className='bg-slate-400 h-[1px] flex-1 '></div>
      </div>
    </Form>
  );
}
