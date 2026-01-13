import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "auto";
export type AccentColor = "blue" | "purple" | "teal" | "red" | "orange";
export type TextSize = "small" | "medium" | "large";

interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentLight: string;
  error: string;
  success: string;
}

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  accentColor: AccentColor;
  textSize: TextSize;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setTextSize: (size: TextSize) => void;
}

const accentColorMap: Record<AccentColor, { primary: string; light: string }> =
  {
    blue: { primary: "#007AFF", light: "#4DA3FF" },
    purple: { primary: "#AF52DE", light: "#D4A5F0" },
    teal: { primary: "#5AC8FA", light: "#8DD4FB" },
    red: { primary: "#FF3B30", light: "#FF6B63" },
    orange: { primary: "#FF9500", light: "#FFB84D" },
  };

const lightColors: Omit<ThemeColors, "accent" | "accentLight"> = {
  background: "#FFFFFF",
  surface: "#F5F5F5",
  card: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  border: "#E0E0E0",
  error: "#FF3B30",
  success: "#34C759",
};

const darkColors: Omit<ThemeColors, "accent" | "accentLight"> = {
  background: "#0A0E27",
  surface: "#1A1F3A",
  card: "#1F2439",
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  border: "#2A2F44",
  error: "#FF3B30",
  success: "#34C759",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [accentColor, setAccentColorState] = useState<AccentColor>("blue");
  const [textSize, setTextSizeState] = useState<TextSize>("medium");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      const savedAccent = await AsyncStorage.getItem("accentColor");
      const savedTextSize = await AsyncStorage.getItem("textSize");

      if (savedTheme) setThemeState(savedTheme as ThemeMode);
      if (savedAccent) setAccentColorState(savedAccent as AccentColor);
      if (savedTextSize) setTextSizeState(savedTextSize as TextSize);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const setAccentColor = async (color: AccentColor) => {
    setAccentColorState(color);
    try {
      await AsyncStorage.setItem("accentColor", color);
    } catch (error) {
      console.error("Error saving accent color:", error);
    }
  };

  const setTextSize = async (size: TextSize) => {
    setTextSizeState(size);
    try {
      await AsyncStorage.setItem("textSize", size);
    } catch (error) {
      console.error("Error saving text size:", error);
    }
  };

  const isDark =
    theme === "dark" || (theme === "auto" && systemColorScheme === "dark");
  const baseColors = isDark ? darkColors : lightColors;
  const accent = accentColorMap[accentColor];

  const colors: ThemeColors = {
    ...baseColors,
    accent: accent.primary,
    accentLight: accent.light,
  };

  const value: ThemeContextType = {
    theme,
    isDark,
    accentColor,
    textSize,
    colors,
    setTheme,
    setAccentColor,
    setTextSize,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
