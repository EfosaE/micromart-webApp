import {
  GetUserByEmailAuth,
  RegisterAccountAuth,
  VendorAccountAuth,
} from '~/utils/validation';
import { axiosAuthWrapper, axiosInstance } from './axios.server';
import axios, { isAxiosError } from 'axios';
import {
  SuccessResponse,
  UserWithAccessToken,
  VendorFormObject,
} from '~/types';
import catchAsync from '~/utils/catchAsync';

export const signUpUser = catchAsync(async (userData: RegisterAccountAuth) => {
  const response = await axiosInstance.post(
    '/api/v1/auth/register/user',
    userData
  );

  return { success: true, data: response.data };
});
export const signUpVendor = catchAsync(async (userData: VendorFormObject) => {
  const response = await axiosInstance.post(
    '/api/v1/auth/register/vendor',
    userData
  );
  return { success: true, data: response.data };
});
export const loginUser = catchAsync(async (userData: GetUserByEmailAuth) => {
  const response = await axiosInstance.post('/api/v1/auth/login', userData);

  // Extract headers and response data
  const headers = response.headers;
  const data = response.data;
  return {
    success: true,
    data,
    headers,
  };
});

export const getUserProfile = catchAsync<SuccessResponse, [string]>(
  async (access_token: string): Promise<SuccessResponse> => {
    console.log('BE called !!!');

    const response = await axiosAuthWrapper(
      access_token,
      '/api/v1/auth/profile',
      'GET'
    );

    return {
      success: true,
      data: response.data,
    };
  }
);

export const getNewToken = async (refreshToken: string) => {
  console.log('get token called!!', refreshToken);

  try {
    const response = await axios.get(
      `${process.env.NEST_API_URL}/api/v1/auth/refresh`,
      {
        headers: {
          Cookie: `refresh_token=${refreshToken}`, // Attach the refreshToken as a cookie
        },
        withCredentials: true, // This ensures cookies are sent with the request... Nah
      }
    );
    console.log('get token called!!!', response.data);
    const newUserData: UserWithAccessToken = response.data;
    return newUserData;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error);
    }
    console.log(error);
  }
};
