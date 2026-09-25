import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Plain client for auth endpoints (login, signup, OTP). No interceptors:
// a 401 here means "wrong credentials", never "try refreshing".
export const authApi = axios.create({ baseURL });

// Authenticated client for everything else.
const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

// Single-flight refresh: concurrent 401s share one refresh call.
let isRefreshing = false;
let waiters = [];

async function refreshAccessToken() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      waiters.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token stored');

    const { data } = await axios.post(`${baseURL}/api/auth/refresh-token`, {
      refreshToken,
    });

    localStorage.setItem('accessToken', data.accessToken);
    waiters.forEach((w) => w.resolve(data.accessToken));
    waiters = [];
    return data.accessToken;
  } catch (err) {
    waiters.forEach((w) => w.reject(err));
    waiters = [];
    throw err;
  } finally {
    isRefreshing = false;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const isAuthEndpoint = original?.url?.includes('/api/auth/');
    const shouldRefresh =
      error.response?.status === 401 && original && !original._retry && !isAuthEndpoint;

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const newToken = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      // Refresh token is dead too (expired, revoked, or replaced by a
      // login elsewhere). This is the only case that means "logged out".
      logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    }
  }
);

export default api;
