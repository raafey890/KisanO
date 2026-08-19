import axios from 'axios';
import { getAccessToken } from '../features/auth/services/authStorage';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Centralized error response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected system error occurred.';
    let code = 'UNKNOWN_ERROR';
    let errors = null;
    let status = 0;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      status = error.response.status;
      message = error.response.data?.message || 'Server error occurred.';
      code = error.response.data?.code || 'SERVER_ERROR';
      errors = error.response.data?.errors || null;

      // Handle specific HTTP status codes if the backend didn't provide a good message
      if (status === 500 && !error.response.data?.message) {
        message = 'The server encountered an internal error. Our team has been notified.';
        code = 'INTERNAL_SERVER_ERROR';
      } else if (status === 404 && !error.response.data?.message) {
        message = 'The requested resource was not found.';
        code = 'ROUTE_NOT_FOUND';
      } else if (status === 429 && !error.response.data?.message) {
        message = 'Too many requests. Please try again later.';
        code = 'RATE_LIMIT_EXCEEDED';
      } else if (status === 401) {
        // Automatically handled by auth hooks or route guards, but we can set a good message
        if (code === 'SERVER_ERROR') code = 'AUTH_UNAUTHORIZED';
      } else if (status === 403) {
        if (code === 'SERVER_ERROR') code = 'AUTH_FORBIDDEN';
        if (!error.response.data?.message) message = "You do not have permission to perform this action.";
      }
    } else if (error.request) {
      // The request was made but no response was received
      status = 0;
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        message = 'The request timed out. Please check your internet connection and try again.';
        code = 'NETWORK_TIMEOUT';
      } else if (error.message === 'Network Error') {
        message = 'Unable to connect to the server. Please check your internet connection or try again later.';
        code = 'NETWORK_ERROR';
      } else {
        message = 'No response received from the server. Please check your connection.';
        code = 'NETWORK_NO_RESPONSE';
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      message = error.message;
      code = 'REQUEST_SETUP_ERROR';
    }

    return Promise.reject({ message, code, errors, status });
  }
);

export default api;
