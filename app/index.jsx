import {
    NavigationContainer,
    NavigationIndependentTree,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
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
