import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { QuoteTemplate } from '../../services/sharingService';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85;
const cardHeight = cardWidth * 1.2;

interface QuoteCardTemplateProps {
  quote: string;
  author?: string;
  template: QuoteTemplate;
}

export const QuoteCardTemplate = forwardRef<View, QuoteCardTemplateProps>(
  ({ quote, author, template }, ref) => {
    return (
      <View ref={ref} style={[styles.container, { width: cardWidth, height: cardHeight }]}>
        <LinearGradient
          colors={
            template.id === 'minimal'
              ? ['#667eea', '#764ba2']
              : template.id === 'elegant'
              ? ['#f5f7fa', '#c3cfe2']
              : ['#ff9a9e', '#fecfef']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={[styles.quote, { color: template.textColor }]}>
              "{quote}"
            </Text>

            {author && (
              <View style={styles.authorContainer}>
                <View style={[styles.authorLine, { backgroundColor: template.authorColor }]} />
                <Text style={[styles.author, { color: template.authorColor }]}>
                  {author}
                </Text>
              </View>
            )}

            <View style={styles.footer}>
              <Text style={[styles.appName, { color: template.textColor, opacity: 0.7 }]}>
                QuoteVault
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    padding: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quote: {
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 30,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  authorLine: {
    width: 30,
    height: 2,
    marginRight: 10,
  },
  author: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  appName: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
});