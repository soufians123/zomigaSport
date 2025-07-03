'use client';

import type { NewsArticle } from '@/types';
import { initialNews } from '@/lib/news-data';

const LOCAL_STORAGE_KEY = 'zomigasports_newsArticles';

export function getNews(): NewsArticle[] {
    if (typeof window === 'undefined') {
        return initialNews;
    }
    try {
        const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        } else {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialNews));
            return initialNews;
        }
    } catch (error) {
        console.error("Failed to read from localStorage", error);
        return initialNews;
    }
}

export function saveNews(articles: NewsArticle[]): void {
     if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articles));
    } catch (error) {
        console.error("Failed to save to localStorage", error);
    }
}
