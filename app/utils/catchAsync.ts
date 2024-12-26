import { isAxiosError } from 'axios';
import { ErrorResponse } from '~/types';

export default function catchAsync(fn: Function) {
  return async (arg: any) => {
    try {
      return await fn(arg);
    } catch (error) {
      
      if (isAxiosError(error)) {
        const status = error.response?.status || 500;
        if (error.code === 'ECONNREFUSED') {
          return errorResponse(
            'Server is having downtime, please try again later',
            status
          );
        }
        if (error.code === 'ECONNABORTED') {
          return errorResponse(
            'Server timed out, please try again later',
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