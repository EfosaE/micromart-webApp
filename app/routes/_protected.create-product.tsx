import { ActionFunctionArgs } from '@remix-run/node';
import { axiosAuthWrapper, axiosInstance } from '~/services/api/axios.server';

// export const handle = {
//   breadcrumb: () => <Link to='/parent/child'>Child Route</Link>,
// };

export let handle = {
  breadcrumb: () => 'Create-Product',
};

export async function action({ request }: ActionFunctionArgs) {
  const accessToken = await getAccessToken(request);
  const originalFormData = await request.formData();
  console.log('originalFormData', originalFormData);
  const imgFile = originalFormData.get('image');

  // Convert originalFormData into a plain object for zod validation

  const formObject = Object.fromEntries(originalFormData.entries());
  if (imgFile) {
    delete formObject.image;
  }

  // Initialize the zodFormObject with the rest of the form data
  const zodFormObject: { [key: string]: any } = {
    ...formObject,
    price: Number(formObject.price),
    quantity: Number(formObject.quantity),
    tags:
      typeof formObject.tags === 'string'
        ? JSON.parse(formObject.tags)
        : formObject.tags,
  };

  console.log('zodFormObject', zodFormObject);

  // Create FormData
  const requestFormData = new FormData();

  // Append non-file fields to FormData
  for (const [key, value] of Object.entries(zodFormObject)) {
    // Serialize tags to string before appending
    if (key === 'tags') {
      requestFormData.append(key, JSON.stringify(value)); // Stringify the tags array
    } else {
      requestFormData.append(key, value);
    }
  }

  // Append the image file to FormData
  if (imgFile) {
    requestFormData.append('image', imgFile);
  }

  console.log('requestFormData', requestFormData);

  try {
    // Use zod to validate the form data
    productSchema.parse(zodFormObject);
    // BE should transform this data. as I cant because of the file input.
    const response = await createProduct(accessToken!, requestFormData, {
      'Content-Type': 'multipart/form-data',
    });
    if (isErrorResponse(response)) {
      console.log(response);
      return new Response(JSON.stringify({ errorMessage: 'Upload Failed' }), {
        status: response.statusCode || 500, // HTTP status
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    if (isSuccessResponse(response)) {
      const { data } = response;
      console.log(response);
      return new Response(
        JSON.stringify({
          successMessage: `Upload successful for ${data.name} Product ID:${data.id}`,
        }),
        {
          status: 201, // HTTP status
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    // If validation fails, format the errors for the UI
    if (error instanceof ZodError) {
      const { fieldErrors } = error.flatten();
      console.log('fieldErrors', fieldErrors);

      return { errors: fieldErrors };
    }
    return new Response(JSON.stringify({ message: 'Upload failed' }), {
      status: 400, // HTTP status
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

import { Form, Link, useActionData, useNavigation } from '@remix-run/react';
import { Input } from '~/components/Input';
import { Button } from '~/components/Button';
import { useEffect, useState } from 'react';
import ProductTagsDropdown from './products/ProductsTagDropdown';
import { ZodError } from 'zod';
import { getAccessToken } from '~/services/session.server';
import { createProduct } from '~/services/api/product.api';
import { isErrorResponse, isSuccessResponse } from '~/types';
import { productSchema } from '~/utils/validation';
import { TagTypes } from '~/data';
import { enqueueSnackbar } from 'notistack';

export default function CreateProduct() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [isUrl, setIsUrl] = useState(true); // State to track if the user wants to use URL or upload a file
  const [tags, setTags] = useState<{ name: string; tagType: TagTypes }[]>([]);
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    setIsUrl(event.target.value === 'URL');
  };

  useEffect(() => {
    if (actionData?.successMessage) {
      enqueueSnackbar(actionData.successMessage, { variant: 'success' });
    }
    if (actionData?.errorMessage) {
      enqueueSnackbar(actionData.errorMessage, { variant: 'error' });
    }
  }, [actionData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };

  return (
    <Form
      method='post'
      encType='multipart/form-data'
      className='flex flex-col container my-4 gap-4 '>
      <Input
        label='Product Name'
        name='name'
        placeholder='Enter product name'
        error={actionData?.errors?.name}
      />
      <Input
        label='Price'
        name='price'
        type='number'
        placeholder='Enter price (e.g., 10000)'
        min='0'
        error={actionData?.errors?.price}
      />
      <Input
        label='Quantity'
        name='quantity'
        type='number'
        placeholder='Enter quantity'
        min='1'
        error={actionData?.errors?.quantity}
      />
      <ProductTagsDropdown tags={tags} setTags={setTags} />
      {/* Hidden Input for Tags */}
      <input type='hidden' name='tags' value={JSON.stringify(tags)} />
      {actionData?.errors?.tags && (
        <p id={`tags-error`} className='text-red-500 text-sm'>
          {actionData?.errors?.tags}
        </p>
      )}
      <label htmlFor='description'>Description:</label>
      <textarea
        id='description'
        name='description'
        placeholder='Enter a description of the product'
        className={`border  focus:ring-1 focus:outline-none focus:ring-secondary focus:border-secondary block p-2.5 rounded  ${
          actionData?.errors?.description
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-500'
        } `}
      />{' '}
      {actionData?.errors?.description && (
        <p id={`description-error`} className='text-red-500 text-sm'>
          {actionData?.errors?.description}
        </p>
      )}
      {/* Image Input Toggle */}
      <div className=''>
        <label className='block font-medium'>Image Upload</label>
        <div className='mt-2'>
          <label className={`${isUrl && 'text-primary'}`}>
            <input
              type='radio'
              name='imgType'
              value='URL'
              checked={isUrl}
              className='mr-2'
              onChange={handleToggle}
            />
            URL
          </label>
          <label className={`ml-4 ${!isUrl && 'text-primary'}`}>
            <input
              type='radio'
              name='imgType'
              value='FILE'
              className='mr-2'
              checked={!isUrl}
              onChange={handleToggle}
            />
            File
          </label>
        </div>
      </div>
      {/* Conditional rendering based on selected option */}
      {isUrl ? (
        <Input
          label='Image URL'
          name='imgUrl'
          placeholder='Enter image URL'
          error={actionData?.errors?.imgUrl}
        />
      ) : (
        <div className=''>
          <label htmlFor='file' className='block text-sm font-medium'>
            Choose an Image File
          </label>
          <input
            type='file'
            id='image'
            name='image'
            accept='image/*'
            required
            onChange={handleFileChange}
            className='mt-1 block w-full  text-slate-500 file:mr-4 file:py-2
          file:px-4 file:rounded-full file:border-0 file:text-sm
          file:font-semibold file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100 '
          />
        </div>
      )}
      <Button
        label={'Create'}
        className='text-white bg-secondary p-3 w-fit rounded mt-4' disabled={isSubmitting}></Button>
    </Form>
  );
}
