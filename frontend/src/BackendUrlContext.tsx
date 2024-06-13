import React, { createContext, useContext } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

const BackendUrlContext = createContext<string>(BACKEND_URL);

export const useBackendUrl = () => useContext(BackendUrlContext);

export const BackendUrlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BackendUrlContext.Provider value={BACKEND_URL}>
      {children}
    </BackendUrlContext.Provider>
  );
};
