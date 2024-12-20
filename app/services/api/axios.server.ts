import axios from 'axios';
import invariant from 'tiny-invariant';

invariant(process.env.NEST_API_URL, 'No Base URL found');
console.log('Base URL:', process.env.NEST_API_URL);

// Create an axios base instance
export const axiosInstance = axios.create({
  baseURL: process.env.NEST_API_URL, //  NestJS backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies along
});

// axiosInstance.interceptors.request.use((config) => {
//   console.log('Axios Base URL:', config.baseURL);
//   // console.log('Axios Final URL:', config.baseURL + config.url);
//   return config;
// });

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
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 403) {
      // Call your refresh token endpoint
      const response = await axiosInstance.post('/api/v1/auth/refresh');

      const { accessToken } = response.data;
      console.log(response.data, accessToken);
      // Retry the original request
      return axiosInstance(error.config);
    }
    // Extract relevant error details
    const status = error.response?.status; // HTTP status code
    const message = error.response?.data?.message || error.message; // Server message or generic error message
    const data = error.response?.data; // Full server response data

    console.log('From interceptor:', {
      status,
      message,
      data,
    });

    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // Example: Handle token expiration and refresh logic
//     if (error.response?.status === 401) {
//       // Attempt to refresh token or redirect to login
//       console.error('Unauthorized. Redirecting to login...');
//     }
//     return Promise.reject(error);
//   }
// );
