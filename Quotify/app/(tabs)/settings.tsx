import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, AccentColor, TextSize } from "../../contexts/ThemeContext";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Toggle } from "../../components/ui/Toggle";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth
import { Button } from "../../components/ui/Button"; // Import Button
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import {
  scheduleDailyQuoteNotification,
  disableNotifications,
  getNotificationSettings,
  updateNotificationTime,
  sendTestNotification,
} from "../../services/notificationsService";
import { updateUserSettings } from "../../services/profileService";

const accentColors: { name: AccentColor; color: string }[] = [
  { name: "blue", color: "#007AFF" },
  { name: "purple", color: "#AF52DE" },
  { name: "teal", color: "#5AC8FA" },
  { name: "red", color: "#FF3B30" },
  { name: "orange", color: "#FF9500" },
];

const PROFILE_IMAGE_KEY = "user_profile_image"; // Key for AsyncStorage

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
  const { signOut, user } = useAuth(); // Destructure signOut and user from useAuth
  const [loading, setLoading] = useState(false); // Add loading state
  const [darkMode, setDarkMode] = useState(theme === "dark");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationHour, setNotificationHour] = useState(9);
  const [notificationMinute, setNotificationMinute] = useState(0);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null); // State for profile image

  // Load profile image from AsyncStorage on mount
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const storedUri = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
        if (storedUri) {
          setProfileImageUri(storedUri);
        }
      } catch (e) {
        console.error("Failed to load profile image:", e);
      }
    };
    loadProfileImage();
  }, []);

  // Load notification settings
  useEffect(() => {
    const loadNotificationSettings = async () => {
      const settings = await getNotificationSettings();
      if (settings) {
        setNotificationsEnabled(settings.enabled);
        setNotificationHour(settings.hour);
        setNotificationMinute(settings.minute);
      }
    };
    loadNotificationSettings();
  }, []);

  // Save profile image to AsyncStorage whenever it changes
  useEffect(() => {
    const saveProfileImage = async () => {
      try {
        if (profileImageUri) {
          await AsyncStorage.setItem(PROFILE_IMAGE_KEY, profileImageUri);
        } else {
          await AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
        }
      } catch (e) {
        console.error("Failed to save profile image:", e);
      }
    };
    saveProfileImage();
  }, [profileImageUri]);

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    setTheme(value ? "dark" : "light");
  };

  const handleNotificationsToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      const success = await scheduleDailyQuoteNotification(
        notificationHour,
        notificationMinute,
      );
      if (!success) {
        setNotificationsEnabled(false);
        Alert.alert(
          "Error",
          "Failed to enable notifications. Please check permissions.",
        );
      } else {
        // Sync with server if user is logged in
        if (user) {
          await updateUserSettings(user.id, {
            notificationsEnabled: true,
            notificationHour,
            notificationMinute,
          });
        }
      }
    } else {
      await disableNotifications();
      // Sync with server if user is logged in
      if (user) {
        await updateUserSettings(user.id, {
          notificationsEnabled: false,
        });
      }
    }
  };

  const handleNotificationTimeChange = async (hour: number, minute: number) => {
    setNotificationHour(hour);
    setNotificationMinute(minute);
    if (notificationsEnabled) {
      const success = await updateNotificationTime(hour, minute);
      if (!success) {
        Alert.alert("Error", "Failed to update notification time.");
      } else {
        // Sync with server if user is logged in
        if (user) {
          await updateUserSettings(user.id, {
            notificationHour: hour,
            notificationMinute: minute,
          });
        }
      }
    }
  };

  const handleTestNotification = () => {
    sendTestNotification();
    Alert.alert("Test Notification", "A test notification has been sent!");
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          const { error } = await signOut();
          if (error) {
            Alert.alert("Logout Error", error.message);
          } else {
            // Clear profile image from AsyncStorage on logout
            await AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
            setProfileImageUri(null);
          }
          setLoading(false);
        },
      },
    ]);
  };

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant media library access to select a profile image.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const sectionTitleFontSize =
    textSize === "small" ? 10 : textSize === "large" ? 14 : 12;
  const titleFontSize =
    textSize === "small" ? 20 : textSize === "large" ? 28 : 24;
  const labelFontSize =
    textSize === "small" ? 14 : textSize === "large" ? 20 : 16;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: 100,
          // paddingTop: insets.top,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
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
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{
                uri: profileImageUri || "https://i.pravatar.cc/150?img=33", // Default avatar
              }}
              style={styles.profileAvatar}
            />
            <View
              style={[
                styles.cameraIconContainer,
                { backgroundColor: colors.accent },
              ]}
            >
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text
            style={[
              styles.profileName,
              {
                color: colors.text,
                fontSize: titleFontSize,
              },
            ]}
          >
            {user?.email ? user.email.split("@")[0] : "Guest User"}
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
          <TouchableOpacity
            style={[
              styles.editButton,
              {
                backgroundColor: colors.accent,
              },
            ]}
            onPress={() => router.push("/profile" as any)}
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
                Daily Notifications
              </Text>
            </View>
            <Toggle
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
            />
          </View>

          {notificationsEnabled && (
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
                  Notification Time
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  {
                    backgroundColor: colors.accent,
                  },
                ]}
                onPress={() => {
                  // Simple time picker - in a real app you'd use a proper time picker
                  Alert.alert(
                    "Set Notification Time",
                    "Choose your preferred time for daily quote notifications",
                    [
                      {
                        text: "8:00 AM",
                        onPress: () => handleNotificationTimeChange(8, 0),
                      },
                      {
                        text: "9:00 AM",
                        onPress: () => handleNotificationTimeChange(9, 0),
                      },
                      {
                        text: "12:00 PM",
                        onPress: () => handleNotificationTimeChange(12, 0),
                      },
                      {
                        text: "6:00 PM",
                        onPress: () => handleNotificationTimeChange(18, 0),
                      },
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                    ],
                  );
                }}
              >
                <Text style={styles.timeButtonText}>
                  {notificationHour.toString().padStart(2, "0")}:
                  {notificationMinute.toString().padStart(2, "0")}
                  {notificationHour >= 12 ? " PM" : " AM"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="paper-plane-outline"
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
                Test Notification
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.testButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleTestNotification}
            >
              <Text
                style={[
                  styles.testButtonText,
                  {
                    color: colors.accent,
                    fontSize: labelFontSize,
                  },
                ]}
              >
                Send Test
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
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
            ACCOUNT
          </Text>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push("/profile" as any)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={20} color={colors.text} />
              <Text
                style={[
                  styles.settingLabel,
                  {
                    color: colors.text,
                    fontSize: labelFontSize,
                  },
                ]}
              >
                Profile
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
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
            LEGAL
          </Text>
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

          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <Button
              title={
                loading ? <ActivityIndicator color={colors.text} /> : "Sign Out"
              }
              onPress={handleSignOut}
              variant="destructive"
              size="large"
              disabled={loading}
            />
          </View>
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
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontWeight: "700",
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
  cameraIconContainer: {
    position: "absolute",
    bottom: 12,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
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
  testButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  testButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    marginBottom: 20,
  },
});
