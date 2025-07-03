'use client';

import type { Channel } from '@/types';
import { initialChannels } from '@/lib/channels-data';

const LOCAL_STORAGE_KEY = 'zomigasports_channels';

export function getChannels(): Channel[] {
    if (typeof window === 'undefined') {
        return initialChannels;
    }
    try {
        const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        } else {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialChannels));
            return initialChannels;
        }
    } catch (error) {
        console.error("Failed to read channels from localStorage", error);
        return initialChannels;
    }
}

export function saveChannels(channels: Channel[]): void {
     if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(channels));
    } catch (error) {
        console.error("Failed to save channels to localStorage", error);
    }
}
