import axios from 'axios';

// Backend API URL
export const API_URL = `${
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
}/api`;

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('parentsphere_access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    // Handle expired access token
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;

      const refreshToken = localStorage.getItem(
        'parentsphere_refresh_token'
      );

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${API_URL}/auth/refresh`,
            {
              refreshToken
            },
            {
              withCredentials: true
            }
          );

          // Save new tokens
          localStorage.setItem(
            'parentsphere_access_token',
            data.accessToken
          );

          localStorage.setItem(
            'parentsphere_refresh_token',
            data.refreshToken
          );

          // Add new access token to original request
          original.headers.Authorization = `Bearer ${data.accessToken}`;

          // Retry original request
          return api(original);
        } catch (_refreshError) {
          // Remove authentication data if refresh fails
          localStorage.removeItem('parentsphere_access_token');
          localStorage.removeItem('parentsphere_refresh_token');
          localStorage.removeItem('parentsphere_user');
        }
      }
    }

    return Promise.reject(error);
  }
);

// Extract readable API error messages
export const apiError = (error) =>
  error.response?.data?.message ||
  error.message ||
  'Something went wrong';

export default api;