import { createContext } from 'react';

export const DateRangeContext = createContext({});

export const DateRangeProvider = ({ children }) => {
  return <DateRangeContext.Provider value={{}}>{children}</DateRangeContext.Provider>;
};
