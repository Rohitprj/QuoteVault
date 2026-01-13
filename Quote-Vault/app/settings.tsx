import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, AccentColor, TextSize } from "../contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toggle } from "../components/ui/Toggle";
import { BottomNavigation } from "../components/navigation/BottomNavigation";

const accentColors: { name: AccentColor; color: string }[] = [
  { name: "blue", color: "#007AFF" },
  { name: "purple", color: "#AF52DE" },
  { name: "teal", color: "#5AC8FA" },
  { name: "red", color: "#FF3B30" },
  { name: "orange", color: "#FF9500" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const {
    colors,
    theme,
    accentColor,
    textSize,
    isDark,
    setTheme,
    setAccentColor,
    setTextSize,
  } = useTheme();
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(theme === "dark");
  const [quoteOfTheDayEnabled, setQuoteOfTheDayEnabled] = useState(true);
  const [reminderTime] = useState("08:30 AM");

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    setTheme(value ? "dark" : "light");
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => router.push("/sign-in"),
      },
    ]);
  };

  const sectionTitleFontSize =
    textSize === "small" ? 10 : textSize === "large" ? 14 : 12;
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
          paddingBottom: 100,
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
            Settings
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?img=33",
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
            Marcus Aurelius
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
            marcus.app@stoic.com
          </Text>
          <TouchableOpacity
            style={[
              styles.editButton,
              {
                backgroundColor: colors.accent,
              },
            ]}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textSecondary,
                fontSize: sectionTitleFontSize,
              },
            ]}
          >
            APPEARANCE
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={20} color={colors.text} />
              <Text
                style={[
                  styles.settingLabel,
                  {
                    color: colors.text,
                    fontSize: labelFontSize,
                  },
                ]}
              >
                Dark Mode
              </Text>
            </View>
            <Toggle value={darkMode} onValueChange={handleDarkModeToggle} />
          </View>

          <View style={styles.settingGroup}>
            <Text
              style={[
                styles.settingLabel,
                {
                  color: colors.text,
                  fontSize: labelFontSize,
                  marginBottom: 12,
                },
              ]}
            >
              Accent Color
            </Text>
            <View style={styles.colorSwatches}>
              {accentColors.map((ac) => (
                <TouchableOpacity
                  key={ac.name}
                  onPress={() => setAccentColor(ac.name)}
                  style={[
                    styles.colorSwatch,
                    {
                      backgroundColor: ac.color,
                      borderColor:
                        accentColor === ac.name ? colors.accent : "transparent",
                      borderWidth: accentColor === ac.name ? 3 : 0,
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.settingGroup}>
            <Text
              style={[
                styles.settingLabel,
                {
                  color: colors.text,
                  fontSize: labelFontSize,
                  marginBottom: 12,
                },
              ]}
            >
              Text Size
            </Text>
            <View style={styles.textSizeContainer}>
              <Text
                style={[styles.textSizeLabel, { color: colors.textSecondary }]}
              >
                A
              </Text>
              <View style={styles.sliderContainer}>
                <View
                  style={[
                    styles.sliderTrack,
                    {
                      backgroundColor: colors.surface,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.sliderFill,
                      {
                        backgroundColor: colors.accent,
                        width:
                          textSize === "small"
                            ? "33%"
                            : textSize === "medium"
                            ? "66%"
                            : "100%",
                      },
                    ]}
                  />
                  <TouchableOpacity
                    style={[
                      styles.sliderThumb,
                      {
                        backgroundColor: "#FFFFFF",
                        left:
                          textSize === "small"
                            ? "33%"
                            : textSize === "medium"
                            ? "66%"
                            : "100%",
                        marginLeft: -8,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.textSizeValue,
                    {
                      color: colors.text,
                      fontSize: labelFontSize,
                    },
                  ]}
                >
                  {textSize.charAt(0).toUpperCase() + textSize.slice(1)}
                </Text>
              </View>
              <Text
                style={[styles.textSizeLabel, { color: colors.textSecondary }]}
              >
                A
              </Text>
            </View>
            <View style={styles.textSizeButtons}>
              {(["small", "medium", "large"] as TextSize[]).map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setTextSize(size)}
                  style={[
                    styles.textSizeButton,
                    {
                      backgroundColor:
                        textSize === size ? colors.accent : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.textSizeButtonText,
                      {
                        color: textSize === size ? "#FFFFFF" : colors.text,
                        fontSize: labelFontSize,
                      },
                    ]}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Daily Inspiration Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textSecondary,
                fontSize: sectionTitleFontSize,
              },
            ]}
          >
            DAILY INSPIRATION
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.text}
              />
              <Text
                style={[
                  styles.settingLabel,
                  {
                    color: colors.text,
                    fontSize: labelFontSize,
                  },
                ]}
              >
                Quote of the Day
              </Text>
            </View>
            <Toggle
              value={quoteOfTheDayEnabled}
              onValueChange={setQuoteOfTheDayEnabled}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="time-outline" size={20} color={colors.text} />
              <Text
                style={[
                  styles.settingLabel,
                  {
                    color: colors.text,
                    fontSize: labelFontSize,
                  },
                ]}
              >
                Reminder Time
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.timeButton,
                {
                  backgroundColor: colors.accent,
                },
              ]}
            >
              <Text style={styles.timeButtonText}>{reminderTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account/Legal Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingRow}>
            <Text
              style={[
                styles.settingLabel,
                {
                  color: colors.text,
                  fontSize: labelFontSize,
                },
              ]}
            >
              Privacy Policy
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <Text
              style={[
                styles.settingLabel,
                {
                  color: colors.text,
                  fontSize: labelFontSize,
                },
              ]}
            >
              Terms of Service
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={handleSignOut}>
            <Text
              style={[
                styles.settingLabel,
                {
                  color: "#FF3B30",
                  fontSize: labelFontSize,
                },
              ]}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text
          style={[
            styles.version,
            {
              color: colors.textSecondary,
              fontSize: sectionTitleFontSize,
            },
          ]}
        >
          Version 2.4.0 (Stoic Edition)
        </Text>
      </ScrollView>
      <BottomNavigation />
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
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  profileName: {
    fontWeight: "700",
    marginBottom: 4,
  },
  profileEmail: {
    marginBottom: 20,
  },
  editButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    fontWeight: "500",
  },
  settingGroup: {
    marginTop: 8,
  },
  colorSwatches: {
    flexDirection: "row",
    gap: 16,
  },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  textSizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  textSizeLabel: {
    fontSize: 20,
    fontWeight: "700",
  },
  sliderContainer: {
    flex: 1,
    position: "relative",
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    position: "relative",
  },
  sliderFill: {
    height: "100%",
    borderRadius: 2,
  },
  sliderThumb: {
    position: "absolute",
    top: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  textSizeValue: {
    position: "absolute",
    top: -24,
    fontWeight: "600",
  },
  textSizeButtons: {
    flexDirection: "row",
    gap: 8,
  },
  textSizeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  textSizeButtonText: {
    fontWeight: "600",
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    marginBottom: 20,
  },
});
