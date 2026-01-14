import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { QuoteOfTheDay } from "../../components/quote/QuoteOfTheDay";
import { QuoteCard } from "../../components/quote/QuoteCard";
import { mockQuotes, quoteOfTheDay, categories } from "../../data/mockData";

export default function HomeScreen() {
  const router = useRouter();
  const { colors, textSize, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("Motivation");
  const [searchQuery, setSearchQuery] = useState("");
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

  const greetingFontSize =
    textSize === "small" ? 10 : textSize === "large" ? 14 : 12;
  const nameFontSize =
    textSize === "small" ? 20 : textSize === "large" ? 28 : 24;
  const sectionTitleFontSize =
    textSize === "small" ? 18 : textSize === "large" ? 24 : 20;

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
          <View style={styles.headerLeft}>
            <Image
              source={{
                uri: "https://i.pravatar.cc/150?img=12",
              }}
              style={styles.avatar}
            />
            <View>
              <Text
                style={[
                  styles.greeting,
                  {
                    color: colors.textSecondary,
                    fontSize: greetingFontSize,
                  },
                ]}
              >
                GOOD MORNING
              </Text>
              <Text
                style={[
                  styles.name,
                  {
                    color: colors.text,
                    fontSize: nameFontSize,
                  },
                ]}
              >
                Alex Harrison
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={[
              styles.searchInput,
              {
                color: colors.text,
                fontSize:
                  textSize === "small" ? 14 : textSize === "large" ? 18 : 16,
              },
            ]}
            placeholder="Search quotes or authors..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quote of the Day */}
        <QuoteOfTheDay
          quote={quoteOfTheDay.text}
          author={quoteOfTheDay.author}
          isLiked={likedQuotes.has(quoteOfTheDay.id)}
          onLike={() => toggleLike(quoteOfTheDay.id)}
          onShare={() => {}}
        />

        {/* Categories */}
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
              Categories
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.accent }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categories}
          >
            {categories.map((category) => (
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

        {/* For You Section */}
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
              For You
            </Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons
                name="filter-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text
                style={[
                  styles.filterText,
                  {
                    color: colors.textSecondary,
                    fontSize:
                      textSize === "small"
                        ? 10
                        : textSize === "large"
                        ? 14
                        : 12,
                  },
                ]}
              >
                LATEST
              </Text>
            </TouchableOpacity>
          </View>

          {mockQuotes.map((quote) => (
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
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => router.push("/customize-quote" as any)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greeting: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  name: {
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
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
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  filterText: {
    fontWeight: "600",
    letterSpacing: 0.5,
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
