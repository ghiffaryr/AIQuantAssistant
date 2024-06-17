import useBoundStore from '@/store/store';
import axios from 'axios';

export default function setupGlobalAxiosInterceptor() {
  const token = useBoundStore.use.userToken?.();

  axios.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.concat({ 'Access-Control-Allow-Origin': '*' });
    return config;
  });
}
