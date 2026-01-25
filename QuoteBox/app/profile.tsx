import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const PROFILE_IMAGE_KEY = 'user_profile_image'; // Key for AsyncStorage

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, textSize, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth(); // Destructure user from useAuth
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null); // State for profile image

  const titleFontSize =
    textSize === "small" ? 20 : textSize === "large" ? 28 : 24;
  const labelFontSize =
    textSize === "small" ? 14 : textSize === "large" ? 20 : 16;

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

  // Save profile image to AsyncStorage whenever it changes
  useEffect(() => {
    const saveProfileImage = async () => {
      try {
        if (profileImageUri) {
          await AsyncStorage.setItem(PROFILE_IMAGE_KEY, profileImageUri);
        } else {
          // If profileImageUri becomes null, remove it from AsyncStorage
          await AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
        }
      } catch (e) {
        console.error("Failed to save profile image:", e);
      }
    };
    saveProfileImage();
  }, [profileImageUri]);

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant media library access to select a profile image.');
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
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{
                uri: profileImageUri || "https://i.pravatar.cc/150?img=33", // Default avatar
              }}
              style={styles.profileAvatar}
            />
            <View style={[styles.cameraIconContainer, { backgroundColor: colors.accent }]}>
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
  cameraIconContainer: {
    position: 'absolute',
    bottom: 12,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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