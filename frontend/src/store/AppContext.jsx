import { createContext, useContext, useMemo, useState } from 'react';
import { currentFarmer } from '../data/farmerData';
import { crops, selectedCropDefault } from '../data/cropData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [farmer] = useState(currentFarmer);
  const [cropList, setCropList] = useState(crops);
  const [selectedCropId, setSelectedCropId] = useState(selectedCropDefault.id);
  const [selectedMarketId, setSelectedMarketId] = useState('mkt-anand');
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile/tablet drawer
  const [unreadAlertCount, setUnreadAlertCount] = useState(2);

  const selectedCrop = useMemo(
    () => cropList.find((c) => c.id === selectedCropId) ?? cropList[0],
    [cropList, selectedCropId]
  );

  function addCrop(newCrop) {
    setCropList((prev) => [...prev, newCrop]);
  }

  const value = {
    farmer,
    cropList,
    addCrop,
    selectedCrop,
    selectedCropId,
    setSelectedCropId,
    selectedMarketId,
    setSelectedMarketId,
    sidebarOpen,
    setSidebarOpen,
    unreadAlertCount,
    setUnreadAlertCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
