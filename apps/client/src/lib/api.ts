import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
    } }
    
    return Promise.reject(error);
}, );