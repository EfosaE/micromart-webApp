import { ActionFunctionArgs } from '@remix-run/node';
import { axiosInstance } from '~/services/api/axios.server';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const file = formData.get('file');
  console.log(file);
  if (!file) {
    throw new Error('No file found');
  }

  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  try {
    const response = await axiosInstance.post(
      '/api/v1/products/upload',
      uploadFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log(response.data);
    return new Response(
      JSON.stringify({ message: 'Upload successful', data: response.data }), // Serialize success message into the body
      {
        status: 200, // HTTP status
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Upload failed' }), // Serialize success message into the body
      {
        status: 400, // HTTP status
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
