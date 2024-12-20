import { GetUserByEmailAuth, RegisterAccountAuth } from '~/utils/validation';
import { axiosInstance } from './axios.server';
import { isAxiosError } from 'axios';

export const signUpUser = async (userData: RegisterAccountAuth) => {
  try {
    const response = await axiosInstance.post('/api/v1/auth/signup', userData);

    return { success: true, data: response.data };
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status || 500;
      // due to the way prisma handles multiple errors, it stores them as an array of strings
      return {
        success: false,
        error: error.response?.data.response.message,
        statusCode: status,
      };
    } else {
      // Handle non-Axios errors
      console.error('Unexpected Error:', error);
    }
    throw error;
  }
};
export const loginUser = async (userData: GetUserByEmailAuth) => {
  try {
    const response = await axiosInstance.post('/api/v1/auth/login', userData);
    // Extract headers and response data
    const headers = response.headers; // Contains 'set-cookie' and other headers
    const data = response.data;

    return {
      success: true,
      data,
      headers,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status || 500;
      // Check if the error is a connection error (for example, "ECONNREFUSED")
      if (error.code === 'ECONNREFUSED') {
        // Throw a custom error message for the frontend
        return {
          success: false,
          statusCode: status,
          error: 'Server is is having downtime, please try again later',
        };
      }
      // due to the way prisma handles multiple errors, it stores them as an array of strings
      return {
        success: false,
        error: error.response?.data.response.message,
        statusCode: status,
      };
    } else {
      // Handle non-Axios errors
      console.error('Unexpected Error:', error);
    }
    throw error;
  }
};

export const getUserProfile = async (access_token: string) => {
  try {
    const response = await axiosInstance.get('/api/v1/auth/profile', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status || 500;
      // Check if the error is a connection error (for example, "ECONNREFUSED")
      if (error.code === 'ECONNREFUSED') {
        // Throw a custom error message for the frontend
        return {
          success: false,
          error: 'Server is is having downtime, please try again later',
        };
      }
      // due to the way prisma handles multiple errors, it stores them as an array of strings
      return {
        success: false,
        error: error.response?.data.response.message,
        statusCode: status,
      };
    } else {
      // Handle non-Axios errors
      console.error('Unexpected Error:', error);
    }
    throw error;
  }
};
