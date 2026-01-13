import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockQuotes, mockCollections } from "../../data/mockData";

const { width } = Dimensions.get("window");
const collectionCardWidth = (width - 48) / 2 - 8;

export default function LibraryScreen() {
  const router = useRouter();
  const { colors, textSize, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [likedQuotes, setLikedQuotes] = useState<Set<string>>(
    new Set(mockQuotes.filter((q) => q.isLiked).map((q) => q.id))
  );

  const toggleLike = (quoteId: string) => {
    const newLiked = new Set(likedQuotes);
    if (newLiked.has(quoteId)) {
      newLiked.delete(quoteId);
    } else {
      newLiked.add(quoteId);
    }
    setLikedQuotes(newLiked);
  };

  const favoriteQuotes = mockQuotes.filter((q) => likedQuotes.has(q.id));

  const sectionTitleFontSize =
    textSize === "small" ? 20 : textSize === "large" ? 28 : 24;

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
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: colors.accentLight },
            ]}
          />
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: sectionTitleFontSize,
              },
            ]}
          >
            Favorites
          </Text>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Your Collections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: sectionTitleFontSize,
                },
              ]}
            >
              Your Collections
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.accent }]}>
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.collectionsGrid}>
            {mockCollections.map((collection) => (
              <TouchableOpacity
                key={collection.id}
                style={[
                  styles.collectionCard,
                  {
                    backgroundColor: colors.card,
                    width: collectionCardWidth,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: collection.image }}
                  style={styles.collectionImage}
                  resizeMode="cover"
                />
                <View style={styles.collectionOverlay} />
                <View style={styles.collectionContent}>
                  <Text
                    style={[
                      styles.collectionTitle,
                      {
                        color: "#FFFFFF",
                        fontSize:
                          textSize === "small"
                            ? 14
                            : textSize === "large"
                            ? 20
                            : 16,
                      },
                    ]}
                  >
                    {collection.title}
                  </Text>
                  <Text
                    style={[
                      styles.collectionCount,
                      {
                        color: "#FFFFFF",
                        opacity: 0.9,
                        fontSize:
                          textSize === "small"
                            ? 12
                            : textSize === "large"
                            ? 16
                            : 14,
                      },
                    ]}
                  >
                    {collection.quoteCount} Quotes
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Favorite Quotes */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: sectionTitleFontSize,
                marginBottom: 16,
              },
            ]}
          >
            Favorite Quotes
          </Text>

          {favoriteQuotes.map((quote) => (
            <View
              key={quote.id}
              style={[
                styles.favoriteQuoteCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.favoriteQuoteHeader}>
                <View
                  style={[
                    styles.quoteIcon,
                    {
                      backgroundColor: colors.accent,
                    },
                  ]}
                >
                  <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
                </View>
                <TouchableOpacity onPress={() => toggleLike(quote.id)}>
                  <Ionicons
                    name="heart"
                    size={24}
                    color={
                      likedQuotes.has(quote.id)
                        ? colors.accent
                        : colors.textSecondary
                    }
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  styles.favoriteQuoteText,
                  {
                    color: colors.text,
                    fontSize:
                      textSize === "small"
                        ? 16
                        : textSize === "large"
                        ? 22
                        : 18,
                  },
                ]}
              >
                {quote.text}
              </Text>
              <View style={styles.favoriteQuoteFooter}>
                <Text
                  style={[
                    styles.favoriteQuoteAuthor,
                    {
                      color: colors.accent,
                      fontSize:
                        textSize === "small"
                          ? 14
                          : textSize === "large"
                          ? 18
                          : 16,
                    },
                  ]}
                >
                  - {quote.author}
                </Text>
                <Text
                  style={[
                    styles.favoriteQuoteDate,
                    {
                      color: colors.textSecondary,
                      fontSize:
                        textSize === "small"
                          ? 12
                          : textSize === "large"
                          ? 16
                          : 14,
                    },
                  ]}
                >
                  • {quote.dateAdded}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => router.push("/customize-quote" as any)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
    paddingBottom: 24,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
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
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  collectionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  collectionCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 160,
    position: "relative",
  },
  collectionImage: {
    width: "100%",
    height: "100%",
  },
  collectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  collectionContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  collectionTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },
  collectionCount: {
    fontWeight: "500",
  },
  favoriteQuoteCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  favoriteQuoteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  quoteIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteQuoteText: {
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 26,
  },
  favoriteQuoteFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  favoriteQuoteAuthor: {
    fontWeight: "600",
  },
  favoriteQuoteDate: {
    fontWeight: "400",
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
