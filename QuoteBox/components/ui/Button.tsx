import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors, textSize } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    if (variant === 'primary') {
      baseStyle.backgroundColor = colors.accent;
    } else if (variant === 'secondary') {
      baseStyle.backgroundColor = colors.surface;
    } else {
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = colors.border;
    }

    if (size === 'small') {
      baseStyle.paddingVertical = 8;
      baseStyle.paddingHorizontal = 16;
    } else if (size === 'large') {
      baseStyle.paddingVertical = 16;
      baseStyle.paddingHorizontal = 32;
    } else {
      baseStyle.paddingVertical = 12;
      baseStyle.paddingHorizontal = 24;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };

    if (variant === 'primary') {
      baseStyle.color = '#FFFFFF';
    } else if (variant === 'secondary') {
      baseStyle.color = colors.text;
    } else {
      baseStyle.color = colors.text;
    }

    if (size === 'small') {
      baseStyle.fontSize = textSize === 'small' ? 12 : textSize === 'large' ? 16 : 14;
    } else if (size === 'large') {
      baseStyle.fontSize = textSize === 'small' ? 18 : textSize === 'large' ? 24 : 20;
    } else {
      baseStyle.fontSize = textSize === 'small' ? 14 : textSize === 'large' ? 20 : 16;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), (disabled || loading) && { opacity: 0.5 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : colors.text} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
