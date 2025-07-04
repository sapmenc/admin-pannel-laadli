// SelectedDateContext.jsx
import { createContext, useContext, useState } from "react";

export const SelectedDateContext = createContext({
  selectedDate: null,
  setSelectedDate: () => {},
});

export const SelectedDateProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </SelectedDateContext.Provider>
  );
};

// Hook for easy use
export const useSelectedDate = () => useContext(SelectedDateContext);