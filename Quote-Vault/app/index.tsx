import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to tabs (home) on app start
  // Change this to '/sign-in' if you want authentication first
  return <Redirect href="/sign-in" />;
}
