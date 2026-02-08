import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { QuoteCardTemplate } from './QuoteCardTemplates';
import {
  shareQuoteAsText,
  shareQuoteAsImage,
  getQuoteCardTemplates,
  type QuoteTemplate
} from '../../services/sharingService';

const { width } = Dimensions.get('window');

interface ShareQuoteModalProps {
  visible: boolean;
  onClose: () => void;
  quote: string;
  author?: string;
}

export const ShareQuoteModal: React.FC<ShareQuoteModalProps> = ({
  visible,
  onClose,
  quote,
  author,
}) => {
  const { colors } = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<QuoteTemplate | null>(null);
  const captureRef = useRef<View>(null);

  const templates = getQuoteCardTemplates();

  const handleShareAsText = async () => {
    const success = await shareQuoteAsText({ text: quote, author });
    if (success) {
      Alert.alert('Success', 'Quote shared successfully!');
      onClose();
    } else {
      Alert.alert('Error', 'Failed to share quote. Please try again.');
    }
  };

  const handleShareAsImage = async () => {
    if (!selectedTemplate) {
      Alert.alert('Please select a template first');
      return;
    }

    try {
      const result = await shareQuoteAsImage(captureRef, { text: quote, author });
      if (result.success) {
        const message = result.saved
          ? 'Quote shared and saved to gallery!'
          : 'Quote shared successfully!';
        Alert.alert('Success', message);
        onClose();
      } else {
        Alert.alert('Error', 'Failed to share quote image. Please try again.');
      }
    } catch (error) {
      console.error('Error sharing as image:', error);
      Alert.alert('Error', 'Failed to share quote image. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Share Quote</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Share as Text Option */}
          <TouchableOpacity
            style={[styles.shareOption, { backgroundColor: colors.surface }]}
            onPress={handleShareAsText}
            activeOpacity={0.7}
          >
            <View style={[styles.optionIcon, { backgroundColor: colors.accent }]}>
              <Ionicons name="text" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                Share as Text
              </Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                Share the quote as plain text via messaging apps
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Share as Image Options */}
          <View style={styles.imageShareSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Share as Image
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              Choose a beautiful template to share your quote as an image
            </Text>

            {/* Template Selection */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.templatesContainer}
            >
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateOption,
                    {
                      borderColor: selectedTemplate?.id === template.id ? colors.accent : colors.border,
                      borderWidth: selectedTemplate?.id === template.id ? 2 : 1,
                    },
                  ]}
                  onPress={() => setSelectedTemplate(template)}
                  activeOpacity={0.7}
                >
                  <View style={styles.templatePreview}>
                    <QuoteCardTemplate
                      ref={selectedTemplate?.id === template.id ? captureRef : undefined}
                      quote={quote.length > 50 ? quote.substring(0, 50) + '...' : quote}
                      author={author}
                      template={template}
                    />
                  </View>
                  <Text style={[styles.templateName, { color: colors.text }]}>
                    {template.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Share Button */}
            <TouchableOpacity
              style={[
                styles.shareImageButton,
                {
                  backgroundColor: selectedTemplate ? colors.accent : colors.surface,
                },
              ]}
              onPress={handleShareAsImage}
              disabled={!selectedTemplate}
              activeOpacity={0.7}
            >
              <Ionicons name="image" size={20} color={selectedTemplate ? "#FFFFFF" : colors.textSecondary} />
              <Text
                style={[
                  styles.shareImageButtonText,
                  {
                    color: selectedTemplate ? "#FFFFFF" : colors.textSecondary,
                  },
                ]}
              >
                Share as Image
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  imageShareSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  templatesContainer: {
    marginBottom: 20,
  },
  templateOption: {
    width: width * 0.4,
    marginRight: 12,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  templatePreview: {
    width: '100%',
    aspectRatio: 0.85,
    marginBottom: 8,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '500',
  },
  shareImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  shareImageButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});