import { isAxiosError } from 'axios';
import { ErrorResponse } from '~/types';


export default function catchAsync<T, A extends any[]>(
  fn: (...args: A) => Promise<T>
): (...args: A) => Promise<T | ErrorResponse> {
  return async (...args: A): Promise<T | ErrorResponse> => {
    try {
      return await fn(...args);
    } catch (error) {
      // console.log(error);
      if (isAxiosError(error)) {
        const status = error.response?.status || 500;
        if (error.code === 'ECONNREFUSED') {
          return errorResponse(
            'Server is having downtime, please try again later',
            status
          );
        }
        return errorResponse(
          error.response?.data?.response?.message || 'An error occurred',
          status
        );
      }
      return errorResponse('An unexpected error has occurred', 500);
    }
  };
}

const errorResponse = (error: string, statusCode: number): ErrorResponse => ({
  success: false,
  error,
  statusCode,
});
