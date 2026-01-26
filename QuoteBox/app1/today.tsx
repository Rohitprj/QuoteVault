import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { getQuoteOfTheDay, type Quote } from '../services/quoteService';
import { shareQuoteAsText } from '../services/sharingService';

export default function TodayScreen() {
  const router = useRouter();
  const { colors, textSize } = useTheme();
  const [quoteOfTheDay, setQuoteOfTheDay] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuoteOfTheDay();
  }, []);

  const loadQuoteOfTheDay = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await getQuoteOfTheDay();

      if (error) {
        console.error('Error loading quote of the day:', error);
        Alert.alert('Error', 'Failed to load quote of the day');
        return;
      }

      setQuoteOfTheDay(data);
    } catch (error) {
      console.error('Error in loadQuoteOfTheDay:', error);
      Alert.alert('Error', 'Failed to load quote of the day');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!quoteOfTheDay) return;

    const success = await shareQuoteAsText({
      text: quoteOfTheDay.text,
      author: quoteOfTheDay.author
    });

    if (!success) {
      Alert.alert('Error', 'Failed to share quote');
    }
  };

  const handleOpenApp = () => {
    router.replace('/(tabs)/home');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.textSecondary }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleOpenApp} style={styles.openAppButton}>
          <Ionicons name="open-outline" size={20} color="#FFFFFF" />
          <Text style={styles.openAppText}>Open App</Text>
        </TouchableOpacity>
      </View>

      {/* Quote Card */}
      <View style={styles.quoteContainer}>
        <LinearGradient
          colors={[colors.accent, colors.accentLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quoteCard}
        >
          <View style={styles.quoteHeader}>
            <Ionicons name="sparkles" size={24} color="#FFFFFF" />
            <Text style={styles.quoteTitle}>Quote of the Day</Text>
          </View>

          <Text style={[
            styles.quote,
            {
              fontSize: textSize === 'small' ? 18 : textSize === 'large' ? 24 : 20,
              lineHeight: textSize === 'small' ? 24 : textSize === 'large' ? 32 : 28,
            }
          ]}>
            "{quoteOfTheDay?.text || 'No quote available'}"
          </Text>

          {quoteOfTheDay?.author && (
            <View style={styles.authorContainer}>
              <View style={styles.authorLine} />
              <Text style={styles.author}>
                {quoteOfTheDay.author}
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenApp} style={styles.actionButton}>
              <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.appName, { color: colors.textSecondary }]}>
          QuoteVault
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date().toLocaleDateString()}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    alignItems: 'flex-end',
  },
  openAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  openAppText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  quoteContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  quoteCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  quoteTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  quote: {
    color: '#FFFFFF',
    fontStyle: 'italic',
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  authorLine: {
    width: 24,
    height: 2,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    opacity: 0.8,
  },
  author: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
    gap: 4,
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
  },
});