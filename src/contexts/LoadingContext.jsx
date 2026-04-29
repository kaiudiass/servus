import React, { createContext, useContext, useState, useCallback } from 'react';
import Loading from '../components/Loading';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0);

  const showLoading = useCallback(() => setActiveRequests(prev => prev + 1), []);
  const hideLoading = useCallback(() => setActiveRequests(prev => Math.max(0, prev - 1)), []);

  const isLoading = activeRequests > 0;

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      {isLoading && <Loading overlay text="Carregando..." />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
