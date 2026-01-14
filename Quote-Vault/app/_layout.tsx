import { SplashScreen, Stack, useRouter } from "expo-router";
import { ThemeProvider } from "../contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import {
  initializeNotifications,
  handleNotificationResponse,
} from "../services/notificationsService";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  console.log("Session", JSON.stringify(session, null, 2));
  const router = useRouter();

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
    if (!isLoading) {
      if (session) {
        // User is signed in
        router.replace("/(tabs)/home");
      } else {
        // User is not signed in
        router.replace("/sign-in");
      }
      SplashScreen.hideAsync();
    }
  }, [session, isLoading]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

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

// import { SplashScreen, Stack, useRouter } from "expo-router";
// import { ThemeProvider } from "../contexts/ThemeContext";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { AuthProvider, useAuth } from "../contexts/AuthContext";
// import React, { useEffect, useState } from "react";
// import AdvancedSplash from "@/components/AdvancedSplash";

// // Keep native splash visible
// SplashScreen.preventAutoHideAsync();

// function RootLayoutNav() {
//   const { session, isLoading } = useAuth();
//   const router = useRouter();

//   const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

//   useEffect(() => {
//     if (!isLoading) {
//       // Show animated splash for fixed duration
//       const timer = setTimeout(async () => {
//         setShowAnimatedSplash(false);
//         await SplashScreen.hideAsync();

//         if (session) {
//           router.replace("/(tabs)/home");
//         } else {
//           router.replace("/sign-in");
//         }
//       }, 2600); // ⏱ match animation duration

//       return () => clearTimeout(timer);
//     }
//   }, [isLoading, session]);

//   // 1️⃣ While auth loading OR splash animation → show splash
//   if (isLoading || showAnimatedSplash) {
//     return <AdvancedSplash />;
//   }

//   // 2️⃣ After splash → render app routes
//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//             contentStyle: { backgroundColor: "transparent" },
//           }}
//         >
//           <Stack.Screen name="sign-in" />
//           <Stack.Screen name="sign-up" />
//           <Stack.Screen name="(tabs)" />
//           <Stack.Screen name="profile" />
//           <Stack.Screen name="customize-quote" />
//           <Stack.Screen name="reset-password" />
//         </Stack>
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <RootLayoutNav />
//     </AuthProvider>
//   );
// }

// import { SplashScreen, Stack, useRouter } from "expo-router";
// import { ThemeProvider } from "../contexts/ThemeContext";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { AuthProvider, useAuth } from "../contexts/AuthContext";
// import React, { useEffect, useState } from "react";
// import AdvancedSplash from "@/components/AdvancedSplash";

// // 🔒 GLOBAL FLAG (persists across re-renders)
// let hasShownSplash = false;

// // Keep native splash visible
// SplashScreen.preventAutoHideAsync();

// function RootLayoutNav() {
//   const { session, isLoading } = useAuth();
//   const router = useRouter();

//   const [showAnimatedSplash, setShowAnimatedSplash] = useState(!hasShownSplash);

//   useEffect(() => {
//     if (!isLoading && !hasShownSplash) {
//       hasShownSplash = true;

//       const timer = setTimeout(async () => {
//         setShowAnimatedSplash(false);
//         await SplashScreen.hideAsync();

//         if (session) {
//           router.replace("/(tabs)/home");
//         } else {
//           router.replace("/sign-in");
//         }
//       }, 2600);

//       return () => clearTimeout(timer);
//     }
//   }, [isLoading, session]);

//   // 🔥 Show splash ONLY ONCE
//   if (showAnimatedSplash || isLoading) {
//     return <AdvancedSplash />;
//   }

//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="sign-in" />
//           <Stack.Screen name="sign-up" />
//           <Stack.Screen name="(tabs)" />
//           <Stack.Screen name="profile" />
//           <Stack.Screen name="customize-quote" />
//           <Stack.Screen name="reset-password" />
//         </Stack>
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <RootLayoutNav />
//     </AuthProvider>
//   );
// }
