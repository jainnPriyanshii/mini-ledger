import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { LoginScreen } from "./src/screens/LoginScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { CONFIG } from "./src/config";

const MainNavigator: React.FC = () => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={CONFIG.theme.accent} />
      </View>
    );
  }

  return user ? <DashboardScreen /> : <LoginScreen />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: CONFIG.theme.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
