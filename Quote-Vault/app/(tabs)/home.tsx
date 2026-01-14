import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  RefreshControl,
  Alert,
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
import { useAuth } from "../../contexts/AuthContext";
import {
  fetchQuotes,
  fetchQuotesByCategory,
  searchQuotes,
  getQuoteOfTheDay,
  getCategories,
  type Quote
} from "../../services/quoteService";
import {
  toggleFavorite,
  checkFavoriteStatus,
  getFavoriteQuoteIds
} from "../../services/favoritesService";

export default function HomeScreen() {
  const router = useRouter();
  const { colors, textSize, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // State management
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>(["All"]);

  // Quotes data
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quoteOfTheDayData, setQuoteOfTheDayData] = useState<Quote | null>(null);
  const [favoritedQuoteIds, setFavoritedQuoteIds] = useState<Set<number>>(new Set());

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const QUOTES_PER_PAGE = 20;

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load categories
      const { data: categoriesData } = await getCategories();
      if (categoriesData) {
        setAvailableCategories(["All", ...categoriesData]);
      }

      // Load quote of the day
      const { data: qotd } = await getQuoteOfTheDay();
      setQuoteOfTheDayData(qotd);

      // Load user's favorite quote IDs
      if (user) {
        const { data: favoriteIds } = await getFavoriteQuoteIds(user.id);
        if (favoriteIds) {
          setFavoritedQuoteIds(new Set(favoriteIds));
        }
      }

      // Load initial quotes
      await loadQuotes(true);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load quotes function
  const loadQuotes = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
        setCurrentPage(0);
        setHasMore(true);
      } else {
        setIsLoadingMore(true);
      }

      const page = refresh ? 0 : currentPage;
      let result;

      if (searchQuery.trim()) {
        result = await searchQuotes(searchQuery.trim(), page * QUOTES_PER_PAGE, QUOTES_PER_PAGE);
      } else if (selectedCategory !== "All") {
        result = await fetchQuotesByCategory(selectedCategory, page * QUOTES_PER_PAGE, QUOTES_PER_PAGE);
      } else {
        result = await fetchQuotes(page * QUOTES_PER_PAGE, QUOTES_PER_PAGE);
      }

      if (result.error) {
        console.error('Error loading quotes:', result.error);
        Alert.alert('Error', 'Failed to load quotes. Please try again.');
        return;
      }

      if (refresh) {
        setQuotes(result.data || []);
      } else {
        setQuotes(prev => [...prev, ...(result.data || [])]);
      }

      setHasMore(result.hasMore);
      if (!refresh) {
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error in loadQuotes:', error);
      Alert.alert('Error', 'Failed to load quotes. Please try again.');
    } finally {
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [currentPage, searchQuery, selectedCategory]);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(async (quoteId: number) => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to save favorites.');
      return;
    }

    const isCurrentlyFavorited = favoritedQuoteIds.has(quoteId);
    const { success, error } = await toggleFavorite(user.id, quoteId, isCurrentlyFavorited);

    if (success) {
      setFavoritedQuoteIds(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyFavorited) {
          newSet.delete(quoteId);
        } else {
          newSet.add(quoteId);
        }
        return newSet;
      });
    } else {
      Alert.alert('Error', 'Failed to update favorite. Please try again.');
      console.error('Error toggling favorite:', error);
    }
  }, [user, favoritedQuoteIds]);

  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setCurrentPage(0);
    setHasMore(true);
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
    setHasMore(true);
  }, []);

  // Handle pull to refresh
  const handleRefresh = useCallback(() => {
    loadQuotes(true);
  }, [loadQuotes]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isRefreshing) {
      loadQuotes(false);
    }
  }, [hasMore, isLoadingMore, isRefreshing, loadQuotes]);

  // Effects
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (!isLoading) {
      loadQuotes(true);
    }
  }, [selectedCategory, searchQuery]);

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
            onChangeText={handleSearch}
          />
        </View>

        {/* Quote of the Day */}
        {quoteOfTheDayData && (
          <QuoteOfTheDay
            quote={quoteOfTheDayData.text}
            author={quoteOfTheDayData.author || "Unknown"}
            isLiked={favoritedQuoteIds.has(quoteOfTheDayData.id)}
            onLike={() => handleToggleFavorite(quoteOfTheDayData.id)}
            onShare={() => {}}
          />
        )}

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
            {availableCategories.map((category) => (
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
                onPress={() => handleCategoryChange(category)}
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

        {/* Quotes List */}
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
              {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === "All" ? "For You" : selectedCategory}
            </Text>
            {!searchQuery && (
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
            )}
          </View>

          <FlatList
            data={quotes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <QuoteCard
                quote={item.text}
                author={item.author || "Unknown"}
                category={item.category}
                isLiked={favoritedQuoteIds.has(item.id)}
                onLike={() => handleToggleFavorite(item.id)}
                onShare={() => {}}
              />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={colors.accent}
              />
            }
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.loadingMore}>
                  <Text style={{ color: colors.textSecondary }}>Loading more quotes...</Text>
                </View>
              ) : hasMore ? null : (
                <View style={styles.endOfList}>
                  <Text style={{ color: colors.textSecondary }}>
                    {quotes.length === 0 ? "No quotes found" : "You've reached the end"}
                  </Text>
                </View>
              )
            }
            showsVerticalScrollIndicator={false}
          />
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
  loadingMore: {
    padding: 20,
    alignItems: "center",
  },
  endOfList: {
    padding: 20,
    alignItems: "center",
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
