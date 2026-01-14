import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, textSize, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth(); // Destructure user from useAuth

  const titleFontSize =
    textSize === "small" ? 20 : textSize === "large" ? 28 : 24;
  const labelFontSize =
    textSize === "small" ? 14 : textSize === "large" ? 20 : 16;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: insets.top,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.text,
                fontSize: titleFontSize,
              },
            ]}
          >
            Profile
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?img=33", // Placeholder avatar
            }}
            style={styles.profileAvatar}
          />
          <Text
            style={[
              styles.profileName,
              {
                color: colors.text,
                fontSize: titleFontSize,
              },
            ]}
          >
            {user?.email ? user.email.split('@')[0] : "Guest User"}
          </Text>
          <Text
            style={[
              styles.profileEmail,
              {
                color: colors.textSecondary,
                fontSize: labelFontSize,
              },
            ]}
          >
            {user?.email || "No email provided"}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                  fontSize: titleFontSize,
                },
              ]}
            >
              127
            </Text>
            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.textSecondary,
                  fontSize: labelFontSize,
                },
              ]}
            >
              Saved Quotes
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                  fontSize: titleFontSize,
                },
              ]}
            >
              8
            </Text>
            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.textSecondary,
                  fontSize: labelFontSize,
                },
              ]}
            >
              Collections
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                  fontSize: titleFontSize,
                },
              ]}
            >
              45
            </Text>
            <Text
              style={[
                styles.statLabel,
                {
                  color: colors.textSecondary,
                  fontSize: labelFontSize,
                },
              ]}
            >
              Shared
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontWeight: "700",
  },
  placeholder: {
    width: 32,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontWeight: "700",
    marginBottom: 4,
  },
  profileEmail: {
    marginBottom: 20,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
