import { Platform } from "react-native";

declare const process: any;

// Configurable API base URL
// Uses EXPO_PUBLIC_API_URL if configured, otherwise falls back to your machine's Wi-Fi IP
const getApiBaseUrl = (): string => {
  if (typeof process !== "undefined" && process?.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }

  // Your machine's Wi-Fi IP address for Android & Expo Go
  return "http://10.211.84.62:5000";
};

export const API_BASE_URL = getApiBaseUrl();

export const CONFIG = {
  apiBaseUrl: API_BASE_URL,
  appName: "MiniLedger",
  currency: "₹",
  theme: {
    // Elegant Warm Beige & Rich Brown Palette
    primary: "#43281C", // Deep Espresso Brown
    primaryDark: "#2B170E", // Very dark roasted coffee
    accent: "#8F5E39", // Rich Caramel / Saddle Brown
    accentLight: "#F0E4D8", // Soft Warm Cream/Beige
    background: "#FBF7F2", // Luxury Warm Ivory/Beige background
    surface: "#FFFFFF", // Crisp card background
    surfaceSecondary: "#F5ECE1", // Muted Sand
    textNavy: "#2D1D15", // Espresso text (replacing navy)
    textMuted: "#7A685A", // Warm Muted Cocoa
    textLight: "#A89A8E", // Soft Sand Gray
    success: "#2E7D32", // Forest Olive Green for repaid
    successBg: "#F0FDF4",
    danger: "#C53030", // Rust Crimson Red for overdue
    dangerBg: "#FEF2F2",
    warning: "#B45309",
    warningBg: "#FFFBEB",
    border: "#E9DFD3", // Subtle warm border
  },
};
