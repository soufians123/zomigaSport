'use client';

import type { BettingProvider } from '@/types';
import { bettingProviders as initialProviders } from '@/lib/betting-data';

const LOCAL_STORAGE_KEY = 'zomigasports_bettingProviders';

export function getBettingProviders(): BettingProvider[] {
    if (typeof window === 'undefined') {
        return initialProviders;
    }
    try {
        const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        } else {
            // If nothing in localStorage, set initial data and return it
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProviders));
            return initialProviders;
        }
    } catch (error) {
        console.error("Failed to read from localStorage", error);
        // Fallback to initial data if parsing fails
        return initialProviders;
    }
}

export function saveBettingProviders(providers: BettingProvider[]): void {
     if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(providers));
    } catch (error) {
        console.error("Failed to save to localStorage", error);
    }
}
