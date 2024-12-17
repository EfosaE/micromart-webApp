import axios from 'axios';

// Create an axios base instance
export const axiosInstance = axios.create({
  baseURL: process.env.NEST_API_URL, // Your NestJS backend URL
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});




axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 403) {
      // Call your refresh token endpoint
      await axios.post('/refresh', { method: 'POST', credentials: 'include' });

      // Retry the original request
      return axiosInstance(error.config);
    }
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
