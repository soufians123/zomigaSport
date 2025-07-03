'use client';

import type { User } from '@/types';
import { checkUserCredentials, getUsers } from './users-service';

const SESSION_KEY = 'zomigasports_session';

export function dispatchAuthChangeEvent() {
    window.dispatchEvent(new Event('auth-changed'));
}

export function login(email: string, password_input: string): User | null {
    const user = checkUserCredentials(email, password_input);
    if (user) {
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
                dispatchAuthChangeEvent();
            } catch (error) {
                console.error("Failed to save session to localStorage", error);
                return null;
            }
        }
        return user;
    }
    return null;
}

export function logout(): void {
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.removeItem(SESSION_KEY);
            dispatchAuthChangeEvent();
        } catch (error) {
            console.error("Failed to remove session from localStorage", error);
        }
    }
}

export function getCurrentUser(): User | null {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        const sessionData = window.localStorage.getItem(SESSION_KEY);
        if (sessionData) {
            const { userId } = JSON.parse(sessionData);
            if (userId) {
                const users = getUsers();
                return users.find(u => u.id === userId) || null;
            }
        }
        return null;
    } catch (error) {
        console.error("Failed to get current user from localStorage", error);
        return null;
    }
}

export function isAuthenticated(): boolean {
    return getCurrentUser() !== null;
}
