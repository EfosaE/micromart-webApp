import { isAxiosError } from 'axios';
import { ErrorResponse } from '~/types';

export default function catchAsync<T>(
  fn: (...args: any[]) => Promise<T>
): (...args: any[]) => Promise<T | ErrorResponse> {
  return async (...args: any[]): Promise<T | ErrorResponse> => {
    try {
      return await fn(...args);
    } catch (error) {
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
