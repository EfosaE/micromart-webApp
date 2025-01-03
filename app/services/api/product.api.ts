import catchAsync from '~/utils/catchAsync';
import { axiosAuthWrapper, axiosInstance } from './axios.server';
import { isErrorResponse, isSuccessResponse, SuccessResponse } from '~/types';
import { Category } from '~/components/Categories';
import { getCategoriesFromCache, setCategoriesInCache } from '~/utils/cache';

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
    console.log(response);

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

export const fetchCategories = catchAsync<SuccessResponse, []>(
  async (): Promise<SuccessResponse> => {
    const response = await axiosInstance.get('/api/v1/products/categories');

    return {
      success: true,
      data: response.data,
    };
  }
);

export async function getCategories(): Promise<Category[] | null> {
  // Try to get categories from the cache
  let categories = getCategoriesFromCache();

  // If categories are not in the cache, fetch them
  if (!categories) {
    const response = await fetchCategories();

    // Check if the response is successful and store in cache
    if (isSuccessResponse(response)) {
      categories = response.data;
      setCategoriesInCache(response.data);
    }

    // If the response is an error, return null
    if (isErrorResponse(response)) {
      return null;
    }
  }
  if (categories) return categories;

  return null;
}
