import axios from 'axios';

const api = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const tokensStr = localStorage.getItem('tokens');
    if (tokensStr) {
      const tokens = JSON.parse(tokensStr);
      if (tokens.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const tokensStr = localStorage.getItem('tokens');
      if (tokensStr) {
        const tokens = JSON.parse(tokensStr);
        try {
          const response = await axios.post('/api/auth/token/refresh/', {
            refresh: tokens.refresh,
          });
          
          const newTokens = {
            ...tokens,
            access: response.data.access,
          };
          
          localStorage.setItem('tokens', JSON.stringify(newTokens));
          originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('tokens');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
