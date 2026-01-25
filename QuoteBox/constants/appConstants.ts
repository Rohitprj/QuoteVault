// App Constants

export const APP_CONFIG = {
  NAME: 'QuoteVault',
  VERSION: '1.0.0',
  DESCRIPTION: 'Your daily source of inspiration',
} as const;

export const QUOTE_CATEGORIES = [
  'Motivation',
  'Love',
  'Success',
  'Wisdom',
  'Humor',
] as const;

export const THEME_MODES = ['light', 'dark', 'auto'] as const;
export const ACCENT_COLORS = ['blue', 'purple', 'teal', 'red', 'orange'] as const;
export const TEXT_SIZES = ['small', 'medium', 'large'] as const;

export const NOTIFICATION_HOURS = Array.from({ length: 24 }, (_, i) => i);
export const NOTIFICATION_MINUTES = [0, 15, 30, 45];

export const PAGINATION = {
  QUOTES_PER_PAGE: 20,
  FAVORITES_PER_PAGE: 20,
  COLLECTIONS_PER_PAGE: 20,
} as const;

export const STORAGE_KEYS = {
  THEME: 'theme',
  ACCENT_COLOR: 'accentColor',
  TEXT_SIZE: 'textSize',
  NOTIFICATION_SETTINGS: 'notificationSettings',
  USER_PROFILE_IMAGE: 'user_profile_image',
} as const;

export const DEEP_LINKS = {
  RESET_PASSWORD: 'quotevault://reset-password',
  TODAY_WIDGET: 'quotevault://today',
} as const;

export const API_ENDPOINTS = {
  QUOTES: '/api/quotes',
  FAVORITES: '/api/favorites',
  COLLECTIONS: '/api/collections',
  DAILY_QUOTE: '/api/daily-quote',
} as const;

export const SUPABASE_TABLES = {
  QUOTES: 'quotes',
  USER_FAVORITES: 'user_favorites',
  COLLECTIONS: 'collections',
  COLLECTION_QUOTES: 'collection_quotes',
  PROFILES: 'profiles',
} as const;