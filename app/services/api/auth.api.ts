import { GetUserByEmailAuth, RegisterAccountAuth } from '~/utils/validation';
import { axiosInstance } from './axios.server';
import axios, { isAxiosError } from 'axios';
import { UserWithAccessToken } from '~/types';

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
  let status: number;
  try {
    const response = await axiosInstance.post('/api/v1/auth/login', userData);

    // Extract headers and response data
    const headers = response.headers;
    const data = response.data;

    return {
      success: true,
      data,
      headers,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      status = error.response?.status || 500;

      // Connection error (e.g., ECONNREFUSED)
      if (error.code === 'ECONNREFUSED') {
        return {
          success: false,
          statusCode: status,
          error: 'Server is having downtime, please try again later',
        };
      }

      // Handle response errors
      return {
        success: false,
        error:
          error.response?.data?.response?.message ||
          'An unexpected error occurred',
        statusCode: status,
      };
    }

    // Non-Axios errors
    console.error('Unexpected Error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
      statusCode: 500,
    };
  }
};

export const getUserProfile = async (access_token: string) => {
  console.log('BE called II');
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
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
        statusCode: 500,
      };
    }
  }
};

export const getNewToken = async (refreshToken: string) => {
  console.log('get token called!!!');
  try {
    // Send a GET request to your API with cookies included in the header
    const response = await axios.get(
      `${process.env.REMIX_APP_URL}/api/refresh`,
      {
        headers: {
          Cookie: `refresh_token=${refreshToken}`, // Attach the refreshToken as a cookie
        },
        withCredentials: true, // This ensures cookies are sent with the request... Nah
      }
    );
    console.log(response.data);
    const newUserData: UserWithAccessToken = response.data;
    return newUserData;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response);
    }
  }
};
