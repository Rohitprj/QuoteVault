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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QuoteCard } from "../../components/quote/QuoteCard";
import { mockQuotes, categories } from "../../data/mockData";

const { width } = Dimensions.get("window");
const cardWidth = width - 40;

export default function DiscoverScreen() {
  const router = useRouter();
  const { colors, textSize, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  const filteredQuotes =
    selectedCategory === "All"
      ? mockQuotes
      : mockQuotes.filter(
          (q) => q.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const allCategories = ["All", ...categories];
  const sectionTitleFontSize =
    textSize === "small" ? 20 : textSize === "large" ? 28 : 24;

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
              styles.title,
              {
                color: colors.text,
                fontSize: sectionTitleFontSize,
              },
            ]}
          >
            Discover
          </Text>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Trending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flame" size={24} color={colors.accent} />
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: sectionTitleFontSize,
                },
              ]}
            >
              Trending Now
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockQuotes.slice(0, 3).map((quote) => (
              <View
                key={quote.id}
                style={[
                  styles.trendingCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    width: cardWidth * 0.85,
                  },
                ]}
              >
                <View style={styles.trendingHeader}>
                  <Ionicons name="flame" size={20} color={colors.accent} />
                  <Text
                    style={[
                      styles.trendingLabel,
                      {
                        color: colors.accent,
                        fontSize:
                          textSize === "small"
                            ? 10
                            : textSize === "large"
                            ? 14
                            : 12,
                      },
                    ]}
                  >
                    TRENDING
                  </Text>
                </View>
                <Text
                  style={[
                    styles.trendingQuote,
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
                <Text
                  style={[
                    styles.trendingAuthor,
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
                  - {quote.author}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Categories Filter */}
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
            Browse by Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categories}
          >
            {allCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor:
                      selectedCategory === category
                        ? colors.accent
                        : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        selectedCategory === category ? "#FFFFFF" : colors.text,
                      fontSize:
                        textSize === "small"
                          ? 12
                          : textSize === "large"
                          ? 16
                          : 14,
                    },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quotes Grid */}
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
              {selectedCategory === "All" ? "All Quotes" : selectedCategory}
            </Text>
            <Text
              style={[
                styles.quoteCount,
                {
                  color: colors.textSecondary,
                  fontSize:
                    textSize === "small" ? 12 : textSize === "large" ? 16 : 14,
                },
              ]}
            >
              {filteredQuotes.length} quotes
            </Text>
          </View>

          {filteredQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote.text}
              author={quote.author}
              category={quote.category}
              isLiked={likedQuotes.has(quote.id)}
              onLike={() => toggleLike(quote.id)}
              onShare={() => {}}
            />
          ))}
        </View>

        {/* Popular Authors */}
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
            Popular Authors
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { name: "Steve Jobs", image: "https://i.pravatar.cc/150?img=12" },
              {
                name: "Winston Churchill",
                image: "https://i.pravatar.cc/150?img=33",
              },
              {
                name: "Marcus Aurelius",
                image: "https://i.pravatar.cc/150?img=45",
              },
              {
                name: "Theodore Roosevelt",
                image: "https://i.pravatar.cc/150?img=67",
              },
            ].map((author, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.authorCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Image
                  source={{ uri: author.image }}
                  style={styles.authorImage}
                />
                <Text
                  style={[
                    styles.authorName,
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
                  {author.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  title: {
    fontWeight: "700",
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  quoteCount: {
    fontWeight: "500",
  },
  trendingCard: {
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    borderWidth: 1,
  },
  trendingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  trendingLabel: {
    fontWeight: "600",
    letterSpacing: 1,
  },
  trendingQuote: {
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 24,
  },
  trendingAuthor: {
    fontWeight: "600",
  },
  categories: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  categoryText: {
    fontWeight: "600",
  },
  authorCard: {
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 1,
    minWidth: 100,
  },
  authorImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  authorName: {
    fontWeight: "600",
    textAlign: "center",
  },
});
