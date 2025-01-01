import catchAsync from '~/utils/catchAsync';
import { axiosAuthWrapper } from './axios.server';
import { SuccessResponse } from '~/types';

export const createProduct = catchAsync<
  SuccessResponse,
  [string, FormData, Record<string, string>]
>(
  async (
    accessToken: string,
    formData: FormData,
    customHeaders: Record<string, string>
  ): Promise<SuccessResponse> => {
    const response = await axiosAuthWrapper(
      accessToken,
      '/api/v1/products/',
      'POST',
        formData,
          customHeaders // Passing custom headers here
    );
    console.log(response)

    return {
      success: true,
      data: response.data,
    };
  }
);
export const getProduct = catchAsync<
  SuccessResponse,
  [string, FormData, Record<string, string>]
>(
  async (
    accessToken: string,
    formData: FormData,
    customHeaders: Record<string, string>
  ): Promise<SuccessResponse> => {
    const response = await axiosAuthWrapper(
      accessToken,
      '/api/v1/products/',
      'POST',
      formData,
      customHeaders // Passing custom headers here
    );

    return {
      success: true,
      data: response.data,
    };
  }
);