import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "../constants/colors";
import LoginScreen from "../components/LoginScreen";
import GlobalState, { MoneyContext } from "../contexts/GlobalState";
import { globalStyles } from "../styles/globalStyles";

export default function RootLayout() {
  return (
    <GlobalState>
      <AppShell />
    </GlobalState>
  );
}

function AppShell() {
  const { user, authReady } = useContext(MoneyContext);

  if (!authReady) {
    return (
      <View style={[globalStyles.screenContainer, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <>
        <StatusBar backgroundColor={colors.primary} style="light" />
        <LoginScreen />
      </>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={colors.primary} style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
