import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to sign-in screen on app start
  // Change this to '/home' if you want to skip authentication
  return <Redirect href="/sign-in" />;
}
