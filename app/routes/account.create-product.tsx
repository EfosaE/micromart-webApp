import { ActionFunctionArgs, data } from '@remix-run/node';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import { Input } from '~/components/Input';
import { Button } from '~/components/Button';
import { useEffect, useState } from 'react';
import ProductTagsDropdown from './_products/ProductsTagDropdown';
import { ZodError } from 'zod';
import { getAccessToken } from '~/services/session.server';
import { createProduct, fetchTags } from '~/services/api/product.api';
import { isErrorResponse, isSuccessResponse, TagsData } from '~/types';
import { productSchema } from '~/utils/validation';

import { closeSnackbar, enqueueSnackbar, SnackbarKey } from 'notistack';
import { initializeRedis } from '~/services/redis.server';

export let handle = {
  breadcrumb: () => 'Create-Product',
};

export async function loader() {
  const client = await initializeRedis()
  const response = await fetchTags(client); 

  if (isSuccessResponse(response)) {
    // Return the data with the Cache-Control header
    return { tagsData: response.data };
  }

  if (isErrorResponse(response)) {
    return { error: 'Failed to fetch tags' };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const accessToken = await getAccessToken(request);
  const originalFormData = await request.formData();
  const imgFile = originalFormData.get('image');

  // Convert originalFormData into a plain object for zod validation

  const formObject = Object.fromEntries(originalFormData.entries());
  if (imgFile) {
    delete formObject.image;
  }
  console.log(formObject);
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
      return data(
        { errorMessage: response.error || 'Upload Failed' },
        {
          status: response.statusCode || 500, // HTTP status
        }
      );
    }
    if (isSuccessResponse(response)) {
      const { data: product } = response;
      console.log('success!', response);
      return data(
        {
          successMessage: `Upload successful for ${product.name} Product ID:${product.id}`,
        },
        {
          status: 201, // HTTP status
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
  }
  return data(
    { message: 'Upload failed' },
    {
      status: 400, // HTTP status
    }
  );
}

type ActionType = {
  successMessage?: string;
  errorMessage?: string | string[];
  errors?: {
    name: string;
    price: string;
    quantity: string;
    tags: string;
    description: string;
    imgUrl: string;
  };
};
type LoaderData = {
  tagsData?: TagsData;
  error?: string;
};

export default function CreateProduct() {
  const actionData = useActionData<ActionType>();
  const { tagsData, error } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [isUrl, setIsUrl] = useState(true); // State to track if the user wants to use URL or upload a file
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    setIsUrl(event.target.value === 'URL');
  };

  useEffect(() => {
    console.log(tagsData);
    console.log(error);
  }, [tagsData, error]);

  useEffect(() => {
    const action = (snackbarId: SnackbarKey | undefined) => (
      <>
        <button
          onClick={() => {
            closeSnackbar(snackbarId);
            window.location.reload();
          }}>
          dismiss
        </button>
      </>
    );
    if (actionData?.successMessage) {
      enqueueSnackbar(actionData.successMessage, {
        variant: 'success',
        action,
        persist: true,
      });
    }
    if (actionData?.errorMessage) {
      enqueueSnackbar(actionData.errorMessage, {
        variant: 'error',
        action,
        persist: true,
      });
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
      className='flex flex-col my-4 gap-4 '>
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
      <ProductTagsDropdown
        tags={tags}
        setTags={setTags}
        tagsData={tagsData as TagsData}
      />
      {/* Hidden Input for Tags */}
      <input
        type='hidden'
        name='tags'
        value={JSON.stringify(tags.map((tag) => tag.id))}
      />
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
        label={isSubmitting ? 'Creating...' : 'Create Product'}
        type={'submit'}
        disabled={isSubmitting} styles={['w-fit']}
      />
    </Form>
  );
}
