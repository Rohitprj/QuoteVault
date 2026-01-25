import { Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export interface QuoteToShare {
  text: string;
  author?: string;
}

// Share quote as text via system share sheet
export const shareQuoteAsText = async (quote: QuoteToShare): Promise<boolean> => {
  try {
    const shareContent = {
      message: `"${quote.text}"${quote.author ? `\n\n— ${quote.author}` : ''}\n\nShared from QuoteVault ✨`,
    };

    const result = await Share.share(shareContent);

    // Check if sharing was successful
    if (result.action === Share.sharedAction) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error sharing quote as text:', error);
    return false;
  }
};

// Request media library permissions
export const requestMediaLibraryPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting media library permissions:', error);
    return false;
  }
};

// Save image to device gallery
export const saveImageToGallery = async (imageUri: string): Promise<boolean> => {
  try {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) {
      throw new Error('Media library permission denied');
    }

    const asset = await MediaLibrary.createAssetAsync(imageUri);
    return !!asset;
  } catch (error) {
    console.error('Error saving image to gallery:', error);
    return false;
  }
};

// Generate and share quote image
export const shareQuoteAsImage = async (
  captureRef: any,
  quote: QuoteToShare
): Promise<{ success: boolean; saved?: boolean }> => {
  try {
    // Capture the view as an image
    const uri = await captureRef(captureRef, {
      format: 'png',
      quality: 0.9,
      result: 'tmpfile',
    });

    // Share the image
    const shareResult = await Share.share({
      url: uri,
      message: `Check out this inspiring quote from QuoteVault! ✨`,
    });

    let saved = false;

    // Also save to gallery if user wants
    if (shareResult.action === Share.sharedAction) {
      saved = await saveImageToGallery(uri);
    }

    return { success: true, saved };
  } catch (error) {
    console.error('Error sharing quote as image:', error);
    return { success: false };
  }
};

// Create different quote card templates
export const getQuoteCardTemplates = () => [
  {
    id: 'minimal',
    name: 'Minimal',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#FFFFFF',
    authorColor: 'rgba(255, 255, 255, 0.8)',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    textColor: '#2c3e50',
    authorColor: '#34495e',
  },
  {
    id: 'bold',
    name: 'Bold',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    textColor: '#FFFFFF',
    authorColor: 'rgba(255, 255, 255, 0.9)',
  },
];

export type QuoteTemplate = ReturnType<typeof getQuoteCardTemplates>[0];