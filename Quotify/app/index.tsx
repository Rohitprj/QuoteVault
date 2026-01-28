import { View, Text } from "react-native";
import React from "react";

export default function index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "pink",
      }}
    >
      <Text style={{ color: "white" }}>index</Text>
    </View>
  );
}
