import { Await, Form, useActionData, useLoaderData, useNavigation, useSearchParams } from 'react-router';
import { data, redirect } from 'react-router';
import { Input } from '~/components/Input';
import type { ActionFunctionArgs, MetaFunction } from 'react-router';
import { authSchema, vendorAuthSchema } from '~/utils/validation';
import { ZodError } from 'zod';
import type { HeadersFunction } from 'react-router'; // or cloudflare/deno
import { Suspense, useEffect, useState } from 'react';
import { safeRedirect } from '~/utils/safeRedirect';
import { signUpUser, signUpVendor } from '~/services/api/auth.api';
import { useSnackbar } from 'notistack';
import { isErrorResponse, isSuccessResponse, VendorFormObject } from '~/types';
import { Button } from '~/components/Button';
import Categories, { Category } from '~/components/Categories';
import { getCategories } from '~/services/api/product.api';

export const meta: MetaFunction = () => [{ title: 'Sign Up' }]; // this causes remix to behave a weird way in dev

export async function loader() {
  const categoriesPromise = getCategories(); // defered

  return { categories: categoriesPromise };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const categoryId = formData.get('categoryName[id]')?.toString();
  const categoryName = formData.get('categoryName[name]')?.toString();
  const businessName = formData.get('businessName')?.toString();
  const role = formData.get('role')?.toString();
  const redirectTo = safeRedirect(formData.get('redirectTo')?.toString(), '/');

  const zodFormObject = { name, email, password, categoryName, businessName };
  const vendorFormObject = {
    name,
    email,
    password,
    businessName,
    categoryId,
    role,
  };
  console.log(vendorFormObject);
  try {
    // Use zod to validate the form data
    vendorAuthSchema.parse(zodFormObject);
    // call your signIn endpoint
    const result = await signUpVendor(vendorFormObject);
    if (isSuccessResponse(result)) {
      const successMessage = encodeURIComponent(
        'Sign up successful! Please log in.'
      );
      return redirect(
        `/login?redirectTo=${encodeURIComponent(
          redirectTo
        )}&successMessage=${successMessage}`
      );
    }
    if (isErrorResponse(result)) {
      console.log(result);

      return data({ signUpError: result.error }, {status: result.statusCode,});
    }
  } catch (error) {
    // If validation fails, format the errors for the UI
    if (error instanceof ZodError) {
      const { fieldErrors } = error.flatten();
      console.log('fieldErrors', fieldErrors);
      return { errors: fieldErrors };
    }

    return data({ error: 'Something went wrong' }, { status: 500 });
  }
}
type ActionType = {
  signUpError?: string | string[];
  errors?: VendorFormObject;
};
export default function Register() {
  const { categories } = useLoaderData<any>();
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
      <Categories categoriesPromise={categories as Promise<Category[]>} />

      {actionData?.errors?.categoryName && (
        <p id={`categoryName-error`} className='text-red-500 text-sm'>
          {actionData?.errors?.categoryName}
        </p>
      )}
      <Input
        name={'businessName'}
        label={'business Name'}
        error={actionData?.errors?.businessName}
      />
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
      <input type='hidden' name='role' value='VENDOR' />
      <Button
        label={isSubmitting ? 'Please Wait...' : 'Sign Up'}
        type={'submit'}
        disabled={isSubmitting} styles={['w-full']}
      />
    </Form>
  );
}
