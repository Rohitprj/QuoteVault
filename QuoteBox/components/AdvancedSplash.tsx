// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withDelay,
//   withSpring,
//   withTiming,
// } from "react-native-reanimated";
// import { useEffect } from "react";

// const { width } = Dimensions.get("window");
// const APP_NAME = "Quote Vault";

// export default function AdvancedSplash() {
//   return (
//     <LinearGradient
//       colors={["#020617", "#020617", "#020617"]}
//       style={styles.container}
//     >
//       <View style={styles.row}>
//         {APP_NAME.split("").map((char, index) => (
//           <AnimatedLetter key={index} char={char} index={index} />
//         ))}
//       </View>
//     </LinearGradient>
//   );
// }

// function AnimatedLetter({ char, index }: { char: string; index: number }) {
//   const progress = useSharedValue(0);

//   useEffect(() => {
//     progress.value = withDelay(
//       index * 120,
//       withSpring(1, {
//         damping: 14,
//         stiffness: 120,
//       })
//     );
//   }, []);

//   const style = useAnimatedStyle(() => {
//     return {
//       opacity: progress.value,
//       transform: [
//         { perspective: 800 },
//         {
//           translateZ: withTiming(progress.value ? 0 : -200),
//         },
//         {
//           rotateY: `${(1 - progress.value) * 25}deg`,
//         },
//         {
//           scale: progress.value,
//         },
//       ],
//     };
//   });

//   return <Animated.Text style={[styles.text, style]}>{char}</Animated.Text>;
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   row: {
//     flexDirection: "row",
//   },
//   text: {
//     fontSize: 42,
//     fontWeight: "800",
//     color: "#E6F4FE",
//     letterSpacing: 1.5,
//     textShadowColor: "#38BDF8",
//     textShadowRadius: 20,
//   },
// });

import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

const { width } = Dimensions.get("window");
const APP_NAME = "Quote Vault";

export default function AdvancedSplash() {
  return (
    <LinearGradient
      colors={["#020617", "#020617", "#020617"]}
      style={styles.container}
    >
      <View style={styles.row}>
        {APP_NAME.split("").map((char, index) => (
          <AnimatedLetter key={index} char={char} index={index} />
        ))}
      </View>
    </LinearGradient>
  );
}

function AnimatedLetter({ char, index }: { char: string; index: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 120,
      withSpring(1, {
        damping: 14,
        stiffness: 120,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        { perspective: 800 }, // creates depth
        {
          rotateY: `${(1 - progress.value) * 25}deg`, // 3D tilt
        },
        {
          scale: progress.value * 0.85 + 0.15, // coming "closer"
        },
      ],
    };
  });

  return (
    <Animated.Text style={[styles.text, animatedStyle]}>{char}</Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  text: {
    fontSize: 42,
    fontWeight: "800",
    color: "#E6F4FE",
    letterSpacing: 1.5,
    textShadowColor: "#38BDF8",
    textShadowRadius: 20,
  },
});
