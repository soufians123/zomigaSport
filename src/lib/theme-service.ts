'use client';

import type { ThemeSettings } from '@/types';

const LOCAL_STORAGE_KEY = 'zomigasports_themeSettings';

// --- Theme Presets ---
const modernDarkColors = {
  background: '220 13% 11%',
  foreground: '210 20% 98%',
  card: '220 13% 18%',
  cardForeground: '210 20% 98%',
  popover: '220 13% 11%',
  popoverForeground: '210 20% 98%',
  primary: '231 48% 68%',
  primaryForeground: '231 48% 15%',
  secondary: '220 13% 24%',
  secondaryForeground: '210 20% 98%',
  muted: '220 13% 24%',
  mutedForeground: '210 20% 80%',
  accent: '42 100% 50%',
  accentForeground: '220 13% 11%',
  destructive: '0 72% 51%',
  destructiveForeground: '210 20% 98%',
  border: '220 13% 24%',
  input: '220 13% 24%',
  ring: '231 48% 68%',
};

const neonColors = {
  background: '240 10% 3.9%',
  foreground: '0 0% 98%',
  card: '240 10% 10%',
  cardForeground: '0 0% 98%',
  popover: '240 10% 3.9%',
  popoverForeground: '0 0% 98%',
  primary: '300 100% 50%', // Bright Pink/Magenta
  primaryForeground: '0 0% 100%',
  secondary: '200 100% 50%', // Bright Cyan
  secondaryForeground: '0 0% 100%',
  muted: '240 5% 20%',
  mutedForeground: '0 0% 60%',
  accent: '60 100% 50%', // Bright Yellow
  accentForeground: '0 0% 0%',
  destructive: '0 100% 50%', // Bright Red
  destructiveForeground: '0 0% 100%',
  border: '240 5% 15%',
  input: '240 5% 15%',
  ring: '300 100% 50%',
};

export const themePresets = {
  "نيون": neonColors,
  "داكن حديث": modernDarkColors,
};

// --- Initial Settings ---
export const initialThemeSettings: ThemeSettings = {
  // General
  radius: 0.8,
  
  // Fonts
  fontBody: 'Tajawal',
  fontHeadline: 'Cairo',
  
  // Identity
  logoUrl: '',
  siteTitle: 'Zomigasports',
  headerLogoSize: 32,
  headerTitleSize: 'text-2xl',
  headerNavFontSize: 'text-sm',
  footerFontSize: 'text-sm',
  
  // Colors - Default to Neon
  ...neonColors,
};


// --- Service Functions ---
export function getThemeSettings(): ThemeSettings {
    if (typeof window === 'undefined') {
        return initialThemeSettings;
    }
    try {
        const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            return { ...initialThemeSettings, ...JSON.parse(storedData) };
        } else {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialThemeSettings));
            return initialThemeSettings;
        }
    } catch (error) {
        console.error("Failed to read theme settings from localStorage", error);
        return initialThemeSettings;
    }
}

export function saveThemeSettings(settings: ThemeSettings): void {
     if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
        window.dispatchEvent(new Event('theme-changed'));
    } catch (error) {
        console.error("Failed to save theme settings to localStorage", error);
    }
}

export function resetThemeSettings(): ThemeSettings {
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        window.dispatchEvent(new Event('theme-changed'));
    }
    // Return the default (Neon) preset
    return { ...initialThemeSettings, ...neonColors };
}
