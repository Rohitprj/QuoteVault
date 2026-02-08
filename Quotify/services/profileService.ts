import { supabase } from '../utils/supabase';

export interface UserSettings {
  theme: 'light' | 'dark';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  notificationsEnabled: boolean;
  notificationHour: number;
  notificationMinute: number;
}

export interface UserProfile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  settings: UserSettings;
  created_at: string;
  updated_at: string;
}

// Default settings
export const defaultSettings: UserSettings = {
  theme: 'light',
  accentColor: '#007AFF',
  fontSize: 'medium',
  notificationsEnabled: true,
  notificationHour: 9,
  notificationMinute: 0,
};

// Get user profile with settings
export const getUserProfile = async (
  userId: string
): Promise<{ data: UserProfile | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }

    // If profile doesn't exist, return null (will be created on first update)
    if (!data) {
      return { data: null, error: null };
    }

    // Merge with default settings for any missing fields
    const mergedSettings = { ...defaultSettings, ...data.settings };

    return {
      data: {
        ...data,
        settings: mergedSettings,
      },
      error: null
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return { data: null, error };
  }
};

// Update user profile settings
export const updateUserSettings = async (
  userId: string,
  settings: Partial<UserSettings>
): Promise<{ success: boolean; error: any }> => {
  try {
    // First check if profile exists
    const { data: existingProfile } = await getUserProfile(userId);

    const updatedSettings = existingProfile?.settings
      ? { ...existingProfile.settings, ...settings }
      : { ...defaultSettings, ...settings };

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        settings: updatedSettings,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating user settings:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in updateUserSettings:', error);
    return { success: false, error };
  }
};

// Update user display name
export const updateDisplayName = async (
  userId: string,
  displayName: string
): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        display_name: displayName,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating display name:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in updateDisplayName:', error);
    return { success: false, error };
  }
};

// Update user avatar
export const updateAvatar = async (
  userId: string,
  avatarUrl: string
): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating avatar:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in updateAvatar:', error);
    return { success: false, error };
  }
};

// Sync local settings with server on login
export const syncSettingsOnLogin = async (
  userId: string,
  localSettings: Partial<UserSettings>
): Promise<UserSettings> => {
  try {
    const { data: serverProfile } = await getUserProfile(userId);

    if (serverProfile?.settings) {
      // Server has settings, use them (they take precedence)
      return serverProfile.settings;
    } else {
      // No server settings, upload local settings to server
      await updateUserSettings(userId, localSettings);
      return { ...defaultSettings, ...localSettings };
    }
  } catch (error) {
    console.error('Error syncing settings on login:', error);
    return { ...defaultSettings, ...localSettings };
  }
};