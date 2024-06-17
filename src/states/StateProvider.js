import React, { useState, createContext, useContext } from 'react';
import StateContext from './StateContext'; // Adjust the path as needed

const StateProvider = ({ children }) => {
  const [state, setState] = useState({
    // Define your initial state here
    hasLocationPermission: false,
    latitude: 0,
    longitude: 0,
    restaurantList: [],
    selectedKeywords: [],
    fetchCalls: [],
    //selectedcards: [],
    selectedCards: [],
    currentIndex: 0,
    animationComplete: true,
    visible: false,
    checked: false,
    showLoading : true,
    radius: 0.5
  });

  return (
    <StateContext.Provider value={{ state, setState,}}>
      {children}
    </StateContext.Provider>
  );
};

// Create a separate hook for accessing the context value
export const useStateContext = () => useContext(StateContext);

export default StateProvider;
