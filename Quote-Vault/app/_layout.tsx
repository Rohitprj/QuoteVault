import { SplashScreen, Stack, useRouter } from "expo-router";
import { ThemeProvider } from "../contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import {
  initializeNotifications,
  handleNotificationResponse,
} from "../services/notificationsService";

import AdvancedSplash from "../components/AdvancedSplash";

// Keep native splash visible
SplashScreen.preventAutoHideAsync();

// This flag ensures SplashScreen.hideAsync() is called only once
let appIsReady = false;

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  // State to control visibility of AdvancedSplash
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  useEffect(() => {
    // Initialize notifications
    initializeNotifications();

    // Handle notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // This effect runs when auth loading is done or session changes
    if (!isLoading) {
      const timer = setTimeout(
        async () => {
          // Only hide the native splash if the app hasn't been deemed ready yet
          if (!appIsReady) {
            await SplashScreen.hideAsync();
            appIsReady = true; // Mark app as ready
          }
          setShowAnimatedSplash(false); // Hide our animated splash

          if (session) {
            router.replace("/(tabs)/home");
          } else {
            router.replace("/sign-in");
          }
        },
        showAnimatedSplash ? 2600 : 0
      ); // Play animation for 2.6s only on first load, then immediately

      return () => clearTimeout(timer);
    }
  }, [isLoading, session, showAnimatedSplash]);

  // While loading auth or showing animated splash, display the AdvancedSplash component
  if (isLoading || showAnimatedSplash) {
    return <AdvancedSplash />;
  }

  // Once loading is complete and animated splash is hidden, render the main app
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        >
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen
            name="customize-quote"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="reset-password"
            options={{ headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
