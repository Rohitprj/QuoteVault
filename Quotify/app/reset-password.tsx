import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../utils/supabase";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { colors, textSize, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { access_token, refresh_token } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionSet, setSessionSet] = useState(false);

  const headingFontSize =
    textSize === "small" ? 28 : textSize === "large" ? 36 : 32;
  const subheadingFontSize =
    textSize === "small" ? 14 : textSize === "large" ? 18 : 16;

  useEffect(() => {
    async function setSession() {
      if (access_token && refresh_token && !sessionSet) {
        setLoading(true);
        const { error } = await supabase.auth.setSession({
          access_token: access_token as string,
          refresh_token: refresh_token as string,
        });

        if (error) {
          setError(error.message);
          Alert.alert("Error setting session", error.message);
          router.replace("/sign-in");
        } else {
          setSessionSet(true);
        }
        setLoading(false);
      }
    }
    setSession();
  }, [access_token, refresh_token, sessionSet]);

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      Alert.alert("Error", "Please enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      Alert.alert("Password Update Error", error.message);
    } else {
      Alert.alert(
        "Success",
        "Your password has been reset successfully. Please sign in with your new password.",
      );
      router.replace("/sign-in");
    }
    setLoading(false);
  };

  if (!sessionSet && (access_token || refresh_token)) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  if (!sessionSet && !access_token && !refresh_token) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: colors.text }}>Invalid reset password link.</Text>
        <TouchableOpacity
          onPress={() => router.replace("/sign-in")}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: colors.accent }}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
              Reset Your Password
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
              Enter your new password below.
            </Text>
          </View>

          <View style={styles.form}>
            {error && (
              <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            )}
            <Input
              label="New Password"
              placeholder="Enter your new password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <Input
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />

            <Button
              title={
                loading ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  "Reset Password"
                )
              }
              onPress={handlePasswordReset}
              variant="primary"
              size="large"
              style={styles.resetButton}
              disabled={loading}
            />

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => router.replace("/sign-in")}
                disabled={loading}
              >
                <Text style={[styles.footerLink, { color: colors.accent }]}>
                  Back to Sign In
                </Text>
              </TouchableOpacity>
            </View>
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
  resetButton: {
    marginTop: 24,
    marginBottom: 24,
  },
  footer: {
    alignItems: "center",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
