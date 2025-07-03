"use client";

import { useEffect, useCallback } from 'react';
import type { ThemeSettings } from '@/types';
import { getThemeSettings } from '@/lib/theme-service';

function applyTheme(settings: ThemeSettings) {
  let styleEl = document.getElementById('theme-override-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'theme-override-styles';
    document.head.appendChild(styleEl);
  }

  const cssText = `
    :root {
      --radius: ${settings.radius}rem;
    }
    .dark {
      --background: ${settings.background};
      --foreground: ${settings.foreground};
      --card: ${settings.card};
      --card-foreground: ${settings.cardForeground};
      --popover: ${settings.popover};
      --popover-foreground: ${settings.popoverForeground};
      --primary: ${settings.primary};
      --primary-foreground: ${settings.primaryForeground};
      --secondary: ${settings.secondary};
      --secondary-foreground: ${settings.secondaryForeground};
      --muted: ${settings.muted};
      --muted-foreground: ${settings.mutedForeground};
      --accent: ${settings.accent};
      --accent-foreground: ${settings.accentForeground};
      --destructive: ${settings.destructive};
      --destructive-foreground: ${settings.destructiveForeground};
      --border: ${settings.border};
      --input: ${settings.input};
      --ring: ${settings.ring};
    }
    body {
      font-family: "${settings.fontBody}", sans-serif;
    }
    .font-headline, h1, h2, h3, h4, h5, h6 {
      font-family: "${settings.fontHeadline}", sans-serif;
    }
  `;

  styleEl.textContent = cssText;
}

export function ThemeProvider() {
  const handleThemeChange = useCallback(() => {
    const settings = getThemeSettings();
    applyTheme(settings);
  }, []);

  useEffect(() => {
    handleThemeChange();

    window.addEventListener('theme-changed', handleThemeChange);
    
    window.addEventListener('storage', (e) => {
        if (e.key === 'zomigasports_themeSettings') {
            handleThemeChange();
        }
    });
    
    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
      window.removeEventListener('storage', (e) => {
        if (e.key === 'zomigasports_themeSettings') {
            handleThemeChange();
        }
      });
    };
  }, [handleThemeChange]);

  return null;
}
