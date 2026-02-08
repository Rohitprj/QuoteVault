import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";

const { width } = Dimensions.get("window");
const quoteDisplayWidth = width - 40;

type BackgroundStyle = "modern" | "nature" | "majestic" | "abstract";
type FontStyle = "modern" | "classic" | "elegant" | "minimal";

const backgrounds: { name: BackgroundStyle; colors: string[] }[] = [
  { name: "modern", colors: ["#FF6B6B", "#FF8E53", "#FF6B9D", "#C44569"] },
  { name: "nature", colors: ["#2C3E50", "#34495E", "#7F8C8D", "#95A5A6"] },
  { name: "majestic", colors: ["#667EEA", "#764BA2", "#F093FB", "#4FACFE"] },
  { name: "abstract", colors: ["#FFE5B4", "#FFCCCB", "#E6E6FA", "#F0E68C"] },
];

export default function CustomizeQuoteScreen() {
  const router = useRouter();
  const { colors, textSize } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedBackground, setSelectedBackground] =
    useState<BackgroundStyle>("modern");
  const [selectedFont, setSelectedFont] = useState<FontStyle>("modern");
  const [isLiked, setIsLiked] = useState(false);

  const quote = "The only way to do\ngreat work is to love\nwhat you do.";
  const author = "STEVE JOBS";

  const currentBackground = backgrounds.find(
    (bg) => bg.name === selectedBackground,
  );
  const gradientColors = (currentBackground?.colors ||
    backgrounds[0].colors) as [string, string, ...string[]];

  const quoteFontSize =
    textSize === "small" ? 24 : textSize === "large" ? 32 : 28;
  const authorFontSize =
    textSize === "small" ? 12 : textSize === "large" ? 16 : 14;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style="light" />
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
                fontSize:
                  textSize === "small" ? 18 : textSize === "large" ? 24 : 20,
              },
            ]}
          >
            Customize Quote
          </Text>
          <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? colors.accent : colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Quote Display */}
        <View style={styles.quoteDisplayContainer}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quoteDisplay}
          >
            <View style={styles.quoteDisplayHeader}>
              <View style={styles.quoteDisplayIcons}>
                <View style={styles.quoteDisplayIcon} />
                <View style={styles.quoteDisplayIcon} />
              </View>
            </View>
            <View style={styles.quoteContent}>
              <Text
                style={[
                  styles.quoteText,
                  {
                    fontSize: quoteFontSize,
                    lineHeight: quoteFontSize * 1.3,
                  },
                ]}
              >
                {quote}
              </Text>
              <View style={styles.authorContainer}>
                <View style={styles.authorLine} />
                <Text
                  style={[
                    styles.authorText,
                    {
                      fontSize: authorFontSize,
                    },
                  ]}
                >
                  {author}
                </Text>
              </View>
            </View>
            <View style={styles.quoteMarks}>
              <Text style={styles.quoteMark}>&quot;</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Background Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize:
                    textSize === "small" ? 16 : textSize === "large" ? 22 : 18,
                },
              ]}
            >
              Background
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.accent }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.backgrounds}
          >
            {backgrounds.map((bg) => (
              <TouchableOpacity
                key={bg.name}
                onPress={() => setSelectedBackground(bg.name)}
                style={styles.backgroundItem}
              >
                <LinearGradient
                  colors={bg.colors as [string, string, ...string[]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.backgroundThumbnail,
                    selectedBackground === bg.name && {
                      borderColor: colors.accent,
                      borderWidth: 3,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.backgroundLabel,
                    {
                      color: colors.text,
                      fontSize:
                        textSize === "small"
                          ? 12
                          : textSize === "large"
                            ? 16
                            : 14,
                    },
                  ]}
                >
                  {bg.name.charAt(0).toUpperCase() + bg.name.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Font Style Selection */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize:
                  textSize === "small" ? 16 : textSize === "large" ? 22 : 18,
                marginBottom: 16,
              },
            ]}
          >
            Font Style
          </Text>
          <View style={styles.fontStyles}>
            {(["modern", "classic", "elegant", "minimal"] as FontStyle[]).map(
              (font) => (
                <TouchableOpacity
                  key={font}
                  onPress={() => setSelectedFont(font)}
                  style={[
                    styles.fontStyleButton,
                    {
                      backgroundColor:
                        selectedFont === font ? colors.accent : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.fontStyleText,
                      {
                        color: selectedFont === font ? "#FFFFFF" : colors.text,
                        fontSize:
                          textSize === "small"
                            ? 12
                            : textSize === "large"
                              ? 16
                              : 14,
                      },
                    ]}
                  >
                    {font.charAt(0).toUpperCase() + font.slice(1)}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Share Text"
            onPress={() => {}}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />
          <Button
            title="Save as Image"
            onPress={() => {}}
            variant="primary"
            size="large"
            style={styles.actionButton}
          />
        </View>
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
  quoteDisplayContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  quoteDisplay: {
    width: quoteDisplayWidth,
    height: 400,
    borderRadius: 20,
    padding: 24,
    position: "relative",
    overflow: "hidden",
  },
  quoteDisplayHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  quoteDisplayIcons: {
    flexDirection: "row",
    gap: 8,
  },
  quoteDisplayIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  quoteContent: {
    flex: 1,
    justifyContent: "center",
  },
  quoteText: {
    color: "#FFFFFF",
    fontStyle: "italic",
    fontWeight: "400",
    marginBottom: 20,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorLine: {
    width: 24,
    height: 2,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
    opacity: 0.8,
  },
  authorText: {
    color: "#FFFFFF",
    fontWeight: "600",
    letterSpacing: 1,
  },
  quoteMarks: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  quoteMark: {
    fontSize: 80,
    color: "#FFFFFF",
    opacity: 0.3,
    fontWeight: "300",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  backgrounds: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  backgroundItem: {
    marginRight: 16,
    alignItems: "center",
  },
  backgroundThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
  },
  backgroundLabel: {
    fontWeight: "500",
  },
  fontStyles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  fontStyleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  fontStyleText: {
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
  },
});
