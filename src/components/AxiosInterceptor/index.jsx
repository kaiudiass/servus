import { useEffect } from 'react';
import api from '../../services/api';
import { useLoading } from '../../contexts/LoadingContext';

const AxiosInterceptor = ({ children }) => {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        
        if (config.showLoading !== false) {
          showLoading();
        }
        return config;
      },
      (error) => {
        hideLoading();
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        hideLoading();
        return response;
      },
      (error) => {
        hideLoading();
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [showLoading, hideLoading]);

  return children;
};

export default AxiosInterceptor;
