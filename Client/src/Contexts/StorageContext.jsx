import { createContext, useContext, useState } from "react";

// Create context
const StorageContext = createContext();

// Context Provider
export const StorageProvider = ({ children }) => {
  const [storageData, setStorageData] = useState({
    maxStorageLimit: 0,
    usedStorageLimit: 0,
    availableStorageLimit: 0,
  });

  return (
    <StorageContext.Provider value={{ storageData, setStorageData }}>
      {children}
    </StorageContext.Provider>
  );
};

// Custom hook for easier access
export const useStorage = () => useContext(StorageContext);
