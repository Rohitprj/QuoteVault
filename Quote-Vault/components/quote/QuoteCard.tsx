import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { ShareQuoteModal } from './ShareQuoteModal';

interface QuoteCardProps {
  quote: string;
  author: string;
  category?: string;
  isLiked?: boolean;
  onLike?: () => void;
  onShare?: () => void;
  authorImage?: string;
  style?: any;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  author,
  category,
  isLiked = false,
  onLike,
  onShare,
  authorImage,
  style,
}) => {
  const { colors, textSize } = useTheme();
  const [showShareModal, setShowShareModal] = useState(false);

  const quoteFontSize = textSize === 'small' ? 16 : textSize === 'large' ? 22 : 18;
  const authorFontSize = textSize === 'small' ? 12 : textSize === 'large' ? 16 : 14;
  const categoryFontSize = textSize === 'small' ? 10 : textSize === 'large' ? 14 : 12;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={32} color={colors.accent} />
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setShowShareModal(true)}
            activeOpacity={0.7}
            style={styles.actionButton}
          >
            <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLike} activeOpacity={0.7} style={styles.actionButton}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={isLiked ? colors.accent : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text
        style={[
          styles.quote,
          {
            color: colors.text,
            fontSize: quoteFontSize,
            lineHeight: quoteFontSize * 1.5,
          },
        ]}
      >
        {quote}
      </Text>

      <View style={styles.footer}>
        <View style={styles.authorContainer}>
          {authorImage ? (
            <Image source={{ uri: authorImage }} style={styles.authorImage} />
          ) : (
            <View style={[styles.authorPlaceholder, { backgroundColor: colors.accentLight }]} />
          )}
          <View>
            <Text
              style={[
                styles.author,
                {
                  color: colors.text,
                  fontSize: authorFontSize,
                },
              ]}
            >
              {author}
            </Text>
            {category && (
              <Text
                style={[
                  styles.category,
                  {
                    color: colors.textSecondary,
                    fontSize: categoryFontSize,
                  },
                ]}
              >
                {category.toUpperCase()}
              </Text>
            )}
          </View>
        </View>
      </View>

      <ShareQuoteModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        quote={quote}
        author={author}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  quote: {
    fontStyle: 'italic',
    marginBottom: 16,
    fontWeight: '400',
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
  authorImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  authorPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  author: {
    fontWeight: '600',
  },
  category: {
    marginTop: 2,
    fontWeight: '500',
  },
});
