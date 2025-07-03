'use client';

import type { SocialLink } from '@/types';
import { socialLinks as initialLinks } from '@/lib/social-links-data';

const LOCAL_STORAGE_KEY = 'zomigasports_socialLinks';

export function getSocialLinks(): SocialLink[] {
    if (typeof window === 'undefined') {
        return initialLinks;
    }
    try {
        const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        } else {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialLinks));
            return initialLinks;
        }
    } catch (error) {
        console.error("Failed to read from localStorage", error);
        return initialLinks;
    }
}

export function saveSocialLinks(links: SocialLink[]): void {
     if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(links));
        window.dispatchEvent(new Event('social-links-changed'));
    } catch (error) {
        console.error("Failed to save to localStorage", error);
    }
}
