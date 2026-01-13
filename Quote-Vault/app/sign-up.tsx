import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const router = useRouter();
  const { colors, textSize, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const headingFontSize =
    textSize === "small" ? 28 : textSize === "large" ? 36 : 32;
  const subheadingFontSize =
    textSize === "small" ? 14 : textSize === "large" ? 18 : 16;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        }}
        style={styles.backgroundImage}
        blurRadius={10}
      >
        <View
          style={[
            styles.overlay,
            { backgroundColor: colors.background + "E6" },
          ]}
        />
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: Math.max(insets.top, 40),
              paddingBottom: insets.bottom + 20,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.heading,
                {
                  color: colors.text,
                  fontSize: headingFontSize,
                },
              ]}
            >
              Start your journey.
            </Text>
            <Text
              style={[
                styles.subheading,
                {
                  color: colors.textSecondary,
                  fontSize: subheadingFontSize,
                },
              ]}
            >
              Collect words that move you.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button
              title="Create Account"
              onPress={() => router.push("/(tabs)/home")}
              variant="primary"
              size="large"
              style={styles.createButton}
            />

            <View style={styles.divider}>
              <View
                style={[styles.dividerLine, { backgroundColor: colors.border }]}
              />
              <Text
                style={[styles.dividerText, { color: colors.textSecondary }]}
              >
                OR CONTINUE WITH
              </Text>
              <View
                style={[styles.dividerLine, { backgroundColor: colors.border }]}
              />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  { backgroundColor: colors.surface },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-apple" size={24} color={colors.text} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>
                  Apple
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.socialButton,
                  { backgroundColor: colors.surface },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-google" size={24} color={colors.text} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>
                  Google
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text
                style={[styles.footerText, { color: colors.textSecondary }]}
              >
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/sign-in")}>
                <Text style={[styles.footerLink, { color: colors.accent }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.legalText,
                {
                  color: colors.textSecondary,
                  fontSize:
                    textSize === "small" ? 10 : textSize === "large" ? 14 : 12,
                },
              ]}
            >
              By creating an account, you agree to our{" "}
              <Text style={{ textDecorationLine: "underline" }}>
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text style={{ textDecorationLine: "underline" }}>
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  heading: {
    fontWeight: "700",
    marginBottom: 8,
  },
  subheading: {
    fontWeight: "400",
  },
  form: {
    width: "100%",
  },
  createButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  legalText: {
    textAlign: "center",
    lineHeight: 18,
  },
});
