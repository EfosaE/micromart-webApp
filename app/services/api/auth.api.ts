import { GetUserByEmailAuth, RegisterAccountAuth } from '~/utils/validation';
import { axiosInstance } from './axios.server';
import axios from 'axios';
import { UserWithAccessToken } from '~/types';
import catchAsync from '~/utils/catchAsync';

export const signUpUser = catchAsync(async (userData: RegisterAccountAuth) => {
  const response = await axiosInstance.post('/api/v1/auth/signup', userData);

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

export const getUserProfile = catchAsync(async (access_token: string) => {
  console.log('BE called !!!');

  const response = await axiosInstance.get('/api/v1/auth/profile', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return {
    success: true,
    data: response.data,
  };
});

export const getNewToken = catchAsync(async (refreshToken: string) => {
  // Send a GET request to your API with cookies included in the header
  const response = await axios.get(`${process.env.REMIX_APP_URL}/api/refresh`, {
    headers: {
      Cookie: `refresh_token=${refreshToken}`, // Attach the refreshToken as a cookie
    },
    withCredentials: true, // This ensures cookies are sent with the request... Nah
  });
  console.log('response_Token',response.data);
  const newUserData: UserWithAccessToken = response.data;
  return newUserData;
});
