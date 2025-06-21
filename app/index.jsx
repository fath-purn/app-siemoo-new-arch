import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import React from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "../Authorize/AuthProvider";
import "../global.css";
import Navigate from "../navigate/Navigate";

const queryClient = new QueryClient();

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationIndependentTree>
          <NavigationContainer>
            <AuthProvider>
              <Navigate />
            </AuthProvider>
          </NavigationContainer>
        </NavigationIndependentTree>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default RootLayout;
