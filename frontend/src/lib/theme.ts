import { type ThemeConfig } from "@/types/theme"

export const themeConfig = {
  colors: {
    primary: {
      DEFAULT: "#4F46E5", // Indigo 600
      50: "#EEF2FF",
      100: "#E0E7FF",
      200: "#C7D2FE",
      300: "#A5B4FC",
      400: "#818CF8",
      500: "#6366F1",
      600: "#4F46E5",
      700: "#4338CA",
      800: "#3730A3",
      900: "#312E81",
    },
    secondary: {
      DEFAULT: "#1E293B", // Slate 800
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
  },
  borderRadius: {
    DEFAULT: "0.5rem",
    sm: "0.375rem",
    lg: "0.75rem",
    xl: "1rem",
  },
};

export const theme: ThemeConfig = {
  light: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",
    card: "hsl(0 0% 100%)",
    "card-foreground": "hsl(222.2 84% 4.9%)",
    popover: "hsl(0 0% 100%)",
    "popover-foreground": "hsl(222.2 84% 4.9%)",
    primary: "hsl(221.2 83.2% 53.3%)",
    "primary-foreground": "hsl(210 40% 98%)",
    secondary: "hsl(210 40% 96.1%)",
    "secondary-foreground": "hsl(222.2 47.4% 11.2%)",
    muted: "hsl(210 40% 96.1%)",
    "muted-foreground": "hsl(215.4 16.3% 46.9%)",
    accent: "hsl(210 40% 96.1%)",
    "accent-foreground": "hsl(222.2 47.4% 11.2%)",
    destructive: "hsl(0 84.2% 60.2%)",
    "destructive-foreground": "hsl(210 40% 98%)",
    border: "hsl(214.3 31.8% 91.4%)",
    input: "hsl(214.3 31.8% 91.4%)",
    ring: "hsl(221.2 83.2% 53.3%)",
  },
  dark: {
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 98%)",
    card: "hsl(222.2 84% 4.9%)",
    "card-foreground": "hsl(210 40% 98%)",
    popover: "hsl(222.2 84% 4.9%)",
    "popover-foreground": "hsl(210 40% 98%)",
    primary: "hsl(217.2 91.2% 59.8%)",
    "primary-foreground": "hsl(222.2 47.4% 11.2%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    "secondary-foreground": "hsl(210 40% 98%)",
    muted: "hsl(217.2 32.6% 17.5%)",
    "muted-foreground": "hsl(215 20.2% 65.1%)",
    accent: "hsl(217.2 32.6% 17.5%)",
    "accent-foreground": "hsl(210 40% 98%)",
    destructive: "hsl(0 62.8% 30.6%)",
    "destructive-foreground": "hsl(210 40% 98%)",
    border: "hsl(217.2 32.6% 17.5%)",
    input: "hsl(217.2 32.6% 17.5%)",
    ring: "hsl(224.3 76.3% 48%)",
  },
}; 