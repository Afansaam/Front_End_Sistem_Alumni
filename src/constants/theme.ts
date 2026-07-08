/**
 * Theme constants for Pusat Karir & Alumni UNUHA.
 * Brand colors based on afan.end section 7: navy + orange accent.
 */

import "@/global.css";
import { Platform } from "react-native";

// === Brand Colors (from afan.end section 7) ===
export const Brand = {
  navy: "#0B2C4D",
  navyLight: "#0E3A66",
  navyDark: "#081E35",
  orange: "#E97A2B",
  orangeLight: "#F09A56",
  orangeDark: "#C46520",
  white: "#FFFFFF",
  offWhite: "#F5F7FA",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
} as const;

// === Status Badge Colors ===
export const StatusColors = {
  success: "#10B981", // green — terverifikasi, diterima, aktif
  successBg: "#D1FAE5",
  warning: "#F59E0B", // amber — pending
  warningBg: "#FEF3C7",
  danger: "#EF4444", // red — ditolak, suspended
  dangerBg: "#FEE2E2",
  info: "#3B82F6", // blue — info
  infoBg: "#DBEAFE",
} as const;

// === Light / Dark theme ===
export const Colors = {
  light: {
    text: "#111827",
    textSecondary: "#6B7280",
    background: "#F5F7FA",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#E5E7EB",
    border: "#E5E7EB",
    primary: Brand.navy,
    primaryText: Brand.white,
    accent: Brand.orange,
    accentText: Brand.white,
  },
  dark: {
    text: "#F9FAFB",
    textSecondary: "#9CA3AF",
    background: "#0F172A",
    backgroundElement: "#1E293B",
    backgroundSelected: "#334155",
    border: "#334155",
    primary: "#1E4D7B",
    primaryText: "#F9FAFB",
    accent: Brand.orange,
    accentText: Brand.white,
  },
} as const;

export type ThemeColor = keyof (typeof Colors)["light"] &
  keyof (typeof Colors)["dark"];

// === Fonts ===
export const Fonts = Platform.select({
  ios: {
    sans: "Inter",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "Inter",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Inter, var(--font-display), system-ui, sans-serif",
    serif: "var(--font-serif), Georgia, serif",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono), monospace",
  },
});

// === Spacing (4px base unit) ===
export const Spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  "3xl": 32,
  "4xl": 48,
  "5xl": 64,
} as const;

// === Layout ===
export const BottomTabInset =
  Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 1200;
export const SidebarWidth = 280;

// === Border Radius ===
export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// === Shadow ===
export const Shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;
