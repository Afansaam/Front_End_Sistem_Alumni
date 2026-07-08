/**
 * Root layout — entry point for the entire app.
 * Wraps all routes with AuthProvider and uses Stack navigator.
 */
import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Public routes */}
        <Stack.Screen name="index" />
        <Stack.Screen name="masuk" />
        <Stack.Screen name="daftar" />
        <Stack.Screen name="lupa-password" />
        <Stack.Screen name="statistik" />
        <Stack.Screen name="lokasi-kampus" />
        <Stack.Screen name="berita" />
        <Stack.Screen name="profil-alumni" />
        <Stack.Screen name="lowongan" />
        <Stack.Screen name="403" />
        <Stack.Screen name="+not-found" />

        {/* Protected route groups */}
        <Stack.Screen name="(alumni)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(superadmin)" />
      </Stack>
    </AuthProvider>
  );
}
