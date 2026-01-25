import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
}

export const Toggle: React.FC<ToggleProps> = ({ value, onValueChange, style }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.toggle,
        {
          backgroundColor: value ? colors.accent : colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.toggleThumb,
          {
            backgroundColor: '#FFFFFF',
            transform: [{ translateX: value ? 20 : 2 }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
