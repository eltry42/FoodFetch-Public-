import { NavigationContainer } from "@react-navigation/native";
import Stack from "./stack";
import TabNavigator from "./TabNavigator";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { restoreToken } from "../features/authentication/auth";
import { useEffect, useState } from "react";
import CustomLoading from "../screens/OnBoard/Loading";

export default function RootNavigator() {
  const { userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    getValue();
  }, []);

  async function getValue() {
    try {
      const value = await AsyncStorage.getItem("@token");
      if (value != null) {
        //console.log("data saved", value);
        dispatch(restoreToken(value));
      } else {
        //console.log("no data");
        dispatch(restoreToken(null));
      }
    } catch (e) {
      //console.log(e);
    }
  }

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setShowLoading(false);
    }, 1500); // Display loading screen for at least 1 second

    return () => clearTimeout(loadingTimer);
  }, []);

  // Use a state to track whether the loading time has elapsed
  const [loadingTimeElapsed, setLoadingTimeElapsed] = useState(false);

  // Use a state to track whether to proceed to the main navigation
  const [proceedToMainNavigation, setProceedToMainNavigation] = useState(false);

  // Check if userToken becomes available during the loading screen
  useEffect(() => {
    if (!userToken && loadingTimeElapsed) {
      // If userToken is still not available after 3 seconds, proceed to the main navigation.
      setProceedToMainNavigation(true);
    }
  }, [userToken, loadingTimeElapsed]);

  if (showLoading) {
    return <CustomLoading />;
  }

  if (proceedToMainNavigation) {
    return (
      <NavigationContainer>
        <Stack />
      </NavigationContainer>
    );
  }

  // User token is available, proceed to the main navigation.
  return (
    <NavigationContainer>
      {userToken ? <TabNavigator /> : <Stack />}
    </NavigationContainer>
  );
}
