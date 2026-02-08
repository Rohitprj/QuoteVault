import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface QuoteOfTheDayProps {
  quote: string;
  author: string;
  isLiked?: boolean;
  onLike?: () => void;
  onShare?: () => void;
}

export const QuoteOfTheDay: React.FC<QuoteOfTheDayProps> = ({
  quote,
  author,
  isLiked = false,
  onLike,
  onShare,
}) => {
  const { colors, textSize } = useTheme();

  const quoteFontSize = textSize === 'small' ? 20 : textSize === 'large' ? 28 : 24;
  const authorFontSize = textSize === 'small' ? 14 : textSize === 'large' ? 18 : 16;

  return (
    <LinearGradient
      colors={[colors.accent, colors.accentLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="sparkles" size={20} color="#FFFFFF" />
          <Text style={styles.headerText}>QUOTE OF THE DAY</Text>
        </View>
      </View>

      <Text
        style={[
          styles.quote,
          {
            fontSize: quoteFontSize,
            lineHeight: quoteFontSize * 1.3,
          },
        ]}
      >
        {quote}
      </Text>

      <View style={styles.footer}>
        <View style={styles.authorContainer}>
          <View style={styles.authorLine} />
          <Text
            style={[
              styles.author,
              {
                fontSize: authorFontSize,
              },
            ]}
          >
            {author}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onShare} style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLike} style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginLeft: 8,
    opacity: 0.9,
  },
  quote: {
    color: '#FFFFFF',
    fontStyle: 'italic',
    fontWeight: '400',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
