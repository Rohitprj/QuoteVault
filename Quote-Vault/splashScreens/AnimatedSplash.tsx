import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

const APP_NAME = "Quote Vault";

export default function AnimatedSplash() {
  const animatedValues = useRef(
    APP_NAME.split("").map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = animatedValues.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        delay: index * 120,
        useNativeDriver: true,
      })
    );

    Animated.stagger(80, animations).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        {APP_NAME.split("").map((char, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.text,
              {
                opacity: animatedValues[index],
                transform: [
                  {
                    scale: animatedValues[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {char}
          </Animated.Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A", // dark elegant background
    justifyContent: "center",
    alignItems: "center",
  },
  textRow: {
    flexDirection: "row",
  },
  text: {
    fontSize: 36,
    fontWeight: "700",
    color: "#E6F4FE",
    letterSpacing: 1,
  },
});
