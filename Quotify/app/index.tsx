// import { View, Text } from "react-native";
// import React from "react";

// export default function index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         // backgroundColor: "pink",
//       }}
//     >
//       <Text style={{ color: "white" }}>index</Text>
//     </View>
//   );
// }

import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function index() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return <Redirect href={session ? "/(tabs)/home" : "/sign-in"} />;
}
