import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('parentsphere_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('parentsphere_refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('parentsphere_access_token', data.accessToken);
          localStorage.setItem('parentsphere_refresh_token', data.refreshToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch (_refreshError) {
          localStorage.removeItem('parentsphere_access_token');
          localStorage.removeItem('parentsphere_refresh_token');
          localStorage.removeItem('parentsphere_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export const apiError = (error) => error.response?.data?.message || error.message || 'Something went wrong';

export default api;
