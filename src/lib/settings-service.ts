'use client';

import type { Settings } from '@/types';

const LOCAL_STORAGE_KEY = 'zomigasports_settings';

const initialSettings: Settings = {
  socialIconSize: 'md',
};

export function getSettings(): Settings {
    if (typeof window === 'undefined') {
        return initialSettings;
    }
    try {
        const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            // Merge with initial settings to ensure all keys are present
            return { ...initialSettings, ...JSON.parse(storedData) };
        } else {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSettings));
            return initialSettings;
        }
    } catch (error) {
        console.error("Failed to read settings from localStorage", error);
        return initialSettings;
    }
}

export function saveSettings(settings: Settings): void {
     if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
        window.dispatchEvent(new Event('settings-changed'));
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
    }
}
