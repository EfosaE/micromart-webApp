import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import { redirect } from '@remix-run/node';
import { Input } from '~/components/Input';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { authSchema } from '~/utils/validation';
import { ZodError } from 'zod';
import { Button } from '~/components/Button';
import { useContext, useEffect, useState } from 'react';
import { safeRedirect } from '~/utils/safeRedirect';
import { signUpUser } from '~/services/api/auth.api';


export const meta: MetaFunction = () => [{ title: 'Sign Up' }]; // this causes remix to behave a weird way in dev

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
        return redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
      } else if (!result.success) {
        console.log(result);
        // Failure: Return the error message to be displayed on the client
        return new Response(JSON.stringify({ signUpError: result.error }), {
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

export default function Register() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/';
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

 

  // useEffect(() => {

  //   if (actionData?.signUpError) {
  //     // Check if there are multiple errors
  //     if (Array.isArray(actionData.signUpError)) {
  //       // Show each error as a separate toast
  //       actionData.signUpError.forEach((error: string) => {
  //         toast.error(error);
  //       });
  //     } else {
  //       // Single error
  //       toast.error(actionData.signUpError);
  //     }
  //   }
  // }, [actionData]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <Form method='post' className='space-y-6 w-full'>
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
          autoComplete='current-password' // Allow autofill suggestion for new password
          togglePasswordVisibility={togglePasswordVisibility}
          showPassword={showPassword}
        />
      </div>

      <input type='hidden' name='redirectTo' value={redirectTo} />
      <Button
        label={isSubmitting ? 'Please Wait...' : 'Sign Up'}
        type={'submit'}
        disabled={isSubmitting}
      />
    </Form>
  );
}
