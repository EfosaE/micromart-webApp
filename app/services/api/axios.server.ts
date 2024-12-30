import invariant from 'tiny-invariant';

invariant(process.env.NEST_API_URL, 'No Base URL found FOR NEST');
invariant(process.env.REMIX_APP_URL, 'No Base URL found FOR REMIX');
console.log('Base URL:', process.env.NEST_API_URL);

// Create an axios base instance

import axios, { AxiosRequestConfig } from 'axios';

export const axiosAuthWrapper = async (
  accessToken: string,
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any, // Optional payload for POST, PUT, DELETE requests
  headers?: Record<string, string>
) => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEST_API_URL, // Your NestJS backend URL
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...headers
    },
    withCredentials: true, // Send cookies along
  });

  // Make the request using the configured axios instance
  const config: AxiosRequestConfig = {
    url,
    method,
    data, // Include data if provided
  };

  return axiosInstance.request(config); // Return the Axios Promise
};

export const axiosInstance = axios.create({
  baseURL: process.env.NEST_API_URL, //  NestJS backend URL
  // timeout: 10000, no timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies along
});

// // Interceptor to check response headers
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Check for the Set-Cookie header in the response
//     const cookies = response.headers['set-cookie'];
//     if (cookies) {
//       console.log('Cookies set by backend:', cookies);
//     }
//     return response;
//   },
//   (error) => {
//     console.error('Error in response:', error);
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response.status === 403) {
//       // Call your refresh token endpoint
//       const response = await axiosInstance.get('/api/v1/auth/refresh');

//       const { accessToken } = response.data;
//       console.log(response.data, accessToken);
//       // Retry the original request
//       return axiosInstance(error.config);
//     }
//     // Extract relevant error details
//     const status = error.response?.status; // HTTP status code
//     const message = error.response?.data?.message || error.message; // Server message or generic error message
//     const data = error.response?.data; // Full server response data

//     console.log('From interceptor:', {
//       status,
//       message,
//       data,
//     });

//     return Promise.reject(error);
//   }
// );

// try {
//   // Send a GET request to your API with cookies included in the header
//   const response = await axios.get(
//     `${process.env.REMIX_APP_URL}/api/refresh`,
//     {
//       headers: {
//         Cookie: `refresh_token=${refreshToken}`, // Attach the refreshToken as a cookie
//       },
//       withCredentials: true, // This ensures cookies are sent with the request... Nah
//     }
//   );
//   console.log(response.data);
//   const token: string = response.data.accessToken;

// } catch (error) {
//   if (isAxiosError(error)) {
//     console.log(error.response);
//   }
// }
