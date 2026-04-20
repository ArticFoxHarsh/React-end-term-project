import React, { createContext } from 'react';
import useDebates from '../hooks/useDebates';

const DebatesContext = createContext();

export const DebatesProvider = ({ children }) => {
  const debatesStore = useDebates();

  return (
    <DebatesContext.Provider value={debatesStore}>
      {children}
    </DebatesContext.Provider>
  );
};

export default DebatesContext;
