import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";
import GlobalState from "../contexts/GlobalState";
import AuthState from "../contexts/AuthState";

export default function RootLayout() {
  return (
    <AuthState>
      <GlobalState>
        <StatusBar backgroundColor={colors.primary} style="light" />
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GlobalState>
    </AuthState>
  );
}
