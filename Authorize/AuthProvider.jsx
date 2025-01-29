import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const registerLoginAuth = async (idToken) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem("@data/user", idToken);
      setUserToken(idToken);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const logoutAuth = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem("@data/user");
      setUserToken(null);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const getIdToken = await AsyncStorage.getItem("@data/user");
      if (getIdToken) {
        setUserToken(getIdToken); // Fix: Set userToken instead of setUser
      } else {
        setUserToken(null);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, registerLoginAuth, logoutAuth, userToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
