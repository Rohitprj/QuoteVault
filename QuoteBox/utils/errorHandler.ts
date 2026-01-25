import { Alert } from 'react-native';

export interface AppError {
  code?: string;
  message: string;
  details?: any;
}

export class QuoteVaultError extends Error {
  code: string;
  details?: any;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'QuoteVaultError';
  }
}

// Error codes
export const ERROR_CODES = {
  // Authentication errors
  AUTH_SIGN_IN_FAILED: 'AUTH_SIGN_IN_FAILED',
  AUTH_SIGN_UP_FAILED: 'AUTH_SIGN_UP_FAILED',
  AUTH_SIGN_OUT_FAILED: 'AUTH_SIGN_OUT_FAILED',
  AUTH_RESET_PASSWORD_FAILED: 'AUTH_RESET_PASSWORD_FAILED',

  // Network errors
  NETWORK_REQUEST_FAILED: 'NETWORK_REQUEST_FAILED',
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_NO_CONNECTION: 'NETWORK_NO_CONNECTION',

  // Data errors
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  DATA_INVALID: 'DATA_INVALID',
  DATA_SAVE_FAILED: 'DATA_SAVE_FAILED',

  // Permission errors
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  PERMISSION_NOT_GRANTED: 'PERMISSION_NOT_GRANTED',

  // Service errors
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  SERVICE_QUOTA_EXCEEDED: 'SERVICE_QUOTA_EXCEEDED',

  // Unknown errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// Error messages for user display
export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_SIGN_IN_FAILED]: 'Failed to sign in. Please check your credentials.',
  [ERROR_CODES.AUTH_SIGN_UP_FAILED]: 'Failed to create account. Please try again.',
  [ERROR_CODES.AUTH_SIGN_OUT_FAILED]: 'Failed to sign out. Please try again.',
  [ERROR_CODES.AUTH_RESET_PASSWORD_FAILED]: 'Failed to send password reset email.',

  [ERROR_CODES.NETWORK_REQUEST_FAILED]: 'Network request failed. Please check your connection.',
  [ERROR_CODES.NETWORK_TIMEOUT]: 'Request timed out. Please try again.',
  [ERROR_CODES.NETWORK_NO_CONNECTION]: 'No internet connection. Please check your network.',

  [ERROR_CODES.DATA_NOT_FOUND]: 'The requested data could not be found.',
  [ERROR_CODES.DATA_INVALID]: 'The data provided is invalid.',
  [ERROR_CODES.DATA_SAVE_FAILED]: 'Failed to save data. Please try again.',

  [ERROR_CODES.PERMISSION_DENIED]: 'Permission denied. Please grant the required permissions.',
  [ERROR_CODES.PERMISSION_NOT_GRANTED]: 'Permission not granted.',

  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service is currently unavailable. Please try again later.',
  [ERROR_CODES.SERVICE_QUOTA_EXCEEDED]: 'Service quota exceeded. Please try again later.',

  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
} as const;

// Convert various error types to user-friendly messages
export const getErrorMessage = (error: any): string => {
  // Handle Supabase errors
  if (error?.code) {
    switch (error.code) {
      case 'PGRST116': // Not found
        return ERROR_MESSAGES[ERROR_CODES.DATA_NOT_FOUND];
      case '23505': // Unique constraint violation
        return 'This item already exists.';
      case '42501': // Insufficient privilege
        return ERROR_MESSAGES[ERROR_CODES.PERMISSION_DENIED];
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        console.log('Unhandled error code:', error.code, error.message);
    }
  }

  // Handle network errors
  if (error?.message?.includes('timeout')) {
    return ERROR_MESSAGES[ERROR_CODES.NETWORK_TIMEOUT];
  }

  if (error?.message?.includes('network') || error?.message?.includes('connection')) {
    return ERROR_MESSAGES[ERROR_CODES.NETWORK_NO_CONNECTION];
  }

  // Handle QuoteVaultError
  if (error instanceof QuoteVaultError) {
    return error.message;
  }

  // Default error message
  return ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
};

// Show error alert to user
export const showErrorAlert = (error: any, title: string = 'Error') => {
  const message = getErrorMessage(error);
  Alert.alert(title, message);
};

// Handle async operations with error handling
export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  errorTitle: string = 'Error',
  showAlert: boolean = true
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    console.error('Async operation failed:', error);
    if (showAlert) {
      showErrorAlert(error, errorTitle);
    }
    return null;
  }
};

// Log errors for debugging
export const logError = (error: any, context: string = 'Unknown') => {
  console.error(`[${context}] Error:`, {
    message: error?.message,
    code: error?.code,
    stack: error?.stack,
    details: error,
  });
};

// Create custom error
export const createError = (code: keyof typeof ERROR_CODES, details?: any): QuoteVaultError => {
  return new QuoteVaultError(code, ERROR_MESSAGES[code], details);
};