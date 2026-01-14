import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push notification token for push notification!');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Schedule daily quote notification
export const scheduleDailyQuoteNotification = async (
  hour: number = 9,
  minute: number = 0
): Promise<boolean> => {
  try {
    // Cancel any existing notifications first
    await cancelAllNotifications();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('No notification permission granted');
      return false;
    }

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Quote of the Day",
        body: "Your daily inspiration is ready! ✨",
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        color: '#007AFF',
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    // Store notification settings
    await AsyncStorage.setItem('notificationSettings', JSON.stringify({
      enabled: true,
      hour,
      minute,
    }));

    console.log('Daily quote notification scheduled');
    return true;
  } catch (error) {
    console.error('Error scheduling daily notification:', error);
    return false;
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

// Disable notifications
export const disableNotifications = async (): Promise<void> => {
  try {
    await cancelAllNotifications();
    await AsyncStorage.setItem('notificationSettings', JSON.stringify({
      enabled: false,
      hour: 9,
      minute: 0,
    }));
    console.log('Notifications disabled');
  } catch (error) {
    console.error('Error disabling notifications:', error);
  }
};

// Get notification settings
export const getNotificationSettings = async (): Promise<{
  enabled: boolean;
  hour: number;
  minute: number;
} | null> => {
  try {
    const settings = await AsyncStorage.getItem('notificationSettings');
    if (settings) {
      return JSON.parse(settings);
    }
    // Default settings
    return { enabled: true, hour: 9, minute: 0 };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return { enabled: true, hour: 9, minute: 0 };
  }
};

// Update notification time
export const updateNotificationTime = async (
  hour: number,
  minute: number
): Promise<boolean> => {
  try {
    const settings = await getNotificationSettings();
    if (!settings?.enabled) {
      // Just update the stored time for when notifications are re-enabled
      await AsyncStorage.setItem('notificationSettings', JSON.stringify({
        enabled: false,
        hour,
        minute,
      }));
      return true;
    }

    // Reschedule with new time
    return await scheduleDailyQuoteNotification(hour, minute);
  } catch (error) {
    console.error('Error updating notification time:', error);
    return false;
  }
};

// Send immediate test notification
export const sendTestNotification = async (quoteText?: string): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: quoteText || "This is a test notification from QuoteVault! 🎉",
        sound: 'default',
      },
      trigger: null, // Send immediately
    });
    console.log('Test notification sent');
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
};

// Initialize notifications on app start
export const initializeNotifications = async (): Promise<void> => {
  try {
    const settings = await getNotificationSettings();
    if (settings?.enabled) {
      await scheduleDailyQuoteNotification(settings.hour, settings.minute);
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

// Handle notification response (when user taps notification)
export const handleNotificationResponse = (response: Notifications.NotificationResponse): void => {
  const data = response.notification.request.content.data;
  console.log('Notification tapped:', data);
  // Here you could navigate to a specific screen or perform actions
};