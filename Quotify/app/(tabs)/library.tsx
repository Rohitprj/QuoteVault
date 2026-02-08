import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  FlatList,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import {
  getUserCollections,
  getCollectionWithQuotes,
  createCollection,
  type Collection,
  type CollectionWithQuotes
} from "../../services/collectionsService";
import {
  getUserFavorites,
  toggleFavorite,
  type Quote
} from "../../services/favoritesService";

const { width } = Dimensions.get("window");
const collectionCardWidth = (width - 48) / 2 - 8;

export default function LibraryScreen() {
  const router = useRouter();
  const { colors, textSize, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // State management
  const [collections, setCollections] = useState<Collection[]>([]);
  const [favoriteQuotes, setFavoriteQuotes] = useState<Quote[]>([]);
  const [favoritedQuoteIds, setFavoritedQuoteIds] = useState<Set<number>>(new Set());

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Pagination for favorites
  const [favoritesPage, setFavoritesPage] = useState(0);
  const FAVORITES_PER_PAGE = 20;

  // Load collections and favorites
  const loadData = useCallback(async (refresh = false) => {
    if (!user) return;

    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // Load collections
      const { data: collectionsData, error: collectionsError } = await getUserCollections(user.id);
      if (collectionsError) {
        console.error('Error loading collections:', collectionsError);
      } else {
        setCollections(collectionsData || []);
      }

      // Load favorites
      await loadFavorites(true);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  // Load favorites with pagination
  const loadFavorites = useCallback(async (refresh = false) => {
    if (!user) return;

    try {
      if (refresh) {
        setFavoritesPage(0);
        setHasMore(true);
      } else {
        setIsLoadingMore(true);
      }

      const page = refresh ? 0 : favoritesPage;
      const { data, error, hasMore: moreAvailable } = await getUserFavorites(
        user.id,
        page * FAVORITES_PER_PAGE,
        FAVORITES_PER_PAGE
      );

      if (error) {
        console.error('Error loading favorites:', error);
        Alert.alert('Error', 'Failed to load favorites. Please try again.');
        return;
      }

      if (refresh) {
        setFavoriteQuotes(data || []);
        setFavoritedQuoteIds(new Set((data || []).map(q => q.id)));
      } else {
        setFavoriteQuotes(prev => [...prev, ...(data || [])]);
      }

      setHasMore(moreAvailable);
      if (!refresh) {
        setFavoritesPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error in loadFavorites:', error);
      Alert.alert('Error', 'Failed to load favorites. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  }, [user, favoritesPage]);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(async (quoteId: number) => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to manage favorites.');
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

      // Update favorite quotes list
      if (isCurrentlyFavorited) {
        setFavoriteQuotes(prev => prev.filter(q => q.id !== quoteId));
      } else {
        // For adding, we'd need to fetch the quote data - for now, just refresh
        await loadFavorites(true);
      }
    } else {
      Alert.alert('Error', 'Failed to update favorite. Please try again.');
      console.error('Error toggling favorite:', error);
    }
  }, [user, favoritedQuoteIds, loadFavorites]);

  // Handle create new collection
  const handleCreateCollection = useCallback(async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to create collections.');
      return;
    }

    Alert.prompt(
      'Create Collection',
      'Enter a name for your new collection:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async (title) => {
            if (!title?.trim()) return;

            const { data, error } = await createCollection(user.id, title.trim());
            if (error) {
              Alert.alert('Error', 'Failed to create collection. Please try again.');
              console.error('Error creating collection:', error);
            } else {
              setCollections(prev => [data!, ...prev]);
            }
          }
        }
      ]
    );
  }, [user]);

  // Handle pull to refresh
  const handleRefresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  // Handle load more favorites
  const handleLoadMoreFavorites = useCallback(() => {
    if (hasMore && !isLoadingMore && !isRefreshing) {
      loadFavorites(false);
    }
  }, [hasMore, isLoadingMore, isRefreshing, loadFavorites]);

  // Effects
  useEffect(() => {
    loadData();
  }, [loadData]);

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
            {/* Add new collection card */}
            <TouchableOpacity
              style={[
                styles.collectionCard,
                styles.addCollectionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  width: collectionCardWidth,
                },
              ]}
              onPress={handleCreateCollection}
              activeOpacity={0.8}
            >
              <View style={styles.addCollectionContent}>
                <Ionicons name="add" size={32} color={colors.accent} />
                <Text
                  style={[
                    styles.addCollectionText,
                    {
                      color: colors.text,
                      fontSize:
                        textSize === "small"
                          ? 14
                          : textSize === "large"
                          ? 18
                          : 16,
                    },
                  ]}
                >
                  New Collection
                </Text>
              </View>
            </TouchableOpacity>

            {/* Existing collections */}
            {collections.map((collection) => (
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
                  source={{
                    uri: `https://images.unsplash.com/photo-${collection.id === 1 ? '1506905925346-21bda4d32df4' :
                         collection.id === 2 ? '1514320291840-2e0a9bf29a9e' :
                         collection.id === 3 ? '1519681393784-d120267933ba' :
                         '1486406146926-c627a92ad1ab'}?w=400`
                  }}
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
                    0 Quotes
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
            Favorite Quotes ({favoriteQuotes.length})
          </Text>

          {favoriteQuotes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={48} color={colors.textSecondary} />
              <Text
                style={[
                  styles.emptyStateText,
                  {
                    color: colors.textSecondary,
                    fontSize: textSize === "small" ? 14 : textSize === "large" ? 18 : 16,
                  },
                ]}
              >
                No favorite quotes yet
              </Text>
              <Text
                style={[
                  styles.emptyStateSubtext,
                  {
                    color: colors.textSecondary,
                    fontSize: textSize === "small" ? 12 : textSize === "large" ? 16 : 14,
                  },
                ]}
              >
                Tap the heart icon on quotes to save them here
              </Text>
            </View>
          ) : (
            <FlatList
              data={favoriteQuotes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View
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
                    <TouchableOpacity onPress={() => handleToggleFavorite(item.id)}>
                      <Ionicons
                        name="heart"
                        size={24}
                        color={
                          favoritedQuoteIds.has(item.id)
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
                    {item.text}
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
                      - {item.author || "Unknown"}
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
                      • {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              )}
              onEndReached={handleLoadMoreFavorites}
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
                    <Text style={{ color: colors.textSecondary }}>Loading more favorites...</Text>
                  </View>
                ) : null
              }
              showsVerticalScrollIndicator={false}
            />
          )}
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
  addCollectionCard: {
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addCollectionContent: {
    alignItems: "center",
    gap: 8,
  },
  addCollectionText: {
    fontWeight: "600",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    gap: 16,
  },
  emptyStateText: {
    fontWeight: "600",
    textAlign: "center",
  },
  emptyStateSubtext: {
    textAlign: "center",
    opacity: 0.7,
  },
  loadingMore: {
    padding: 20,
    alignItems: "center",
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
