// import { Redirect, Stack } from "expo-router";

// export default function Index() {
//   // Redirect to tabs (home) on app startr
//   // Change this to '/sign-in' if you want authentication first
//   // return <Redirect href="/sign-in" />;
//   return <Stack />;
// }

import { View, Text } from "react-native";

export default function Index() {
  console.log("====================================");
  console.log();
  console.log("====================================");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>App is working 🚀</Text>
    </View>
  );
}
