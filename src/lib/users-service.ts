'use client';

import type { User } from '@/types';
import { initialUsers, initialUserPasswords } from '@/lib/users-data';

const USERS_KEY = 'zomigasports_users';
const PASSWORDS_KEY = 'zomigasports_passwords';

function getFromStorage<T>(key: string, initialData: T): T {
    if (typeof window === 'undefined') {
        return initialData;
    }
    try {
        const storedData = window.localStorage.getItem(key);
        if (storedData) {
            return JSON.parse(storedData);
        } else {
            window.localStorage.setItem(key, JSON.stringify(initialData));
            return initialData;
        }
    } catch (error) {
        console.error(`Failed to read ${key} from localStorage`, error);
        return initialData;
    }
}

function saveToStorage<T>(key: string, data: T): void {
     if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage`, error);
    }
}


// --- User Management ---

export function getUsers(): User[] {
    return getFromStorage(USERS_KEY, initialUsers);
}

export function saveUsers(users: User[]): void {
    saveToStorage(USERS_KEY, users);
}

export function getUserPasswords(): Record<number, string> {
    return getFromStorage(PASSWORDS_KEY, initialUserPasswords);
}

export function saveUserPasswords(passwords: Record<number, string>): void {
    saveToStorage(PASSWORDS_KEY, passwords);
}

export function deleteUser(userId: number): void {
    const users = getUsers().filter(u => u.id !== userId);
    saveUsers(users);

    const passwords = getUserPasswords();
    delete passwords[userId];
    saveUserPasswords(passwords);
}


// --- Authentication ---
export function checkUserCredentials(email: string, password_input: string): User | null {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return null;
    }
    
    // Allow login for both admin and regular users
    if (user.role === 'admin' || user.role === 'user') {
        const passwords = getUserPasswords();
        if (passwords[user.id] === password_input) {
            return user;
        }
    }
    
    return null;
}

// --- Signup ---
export function createUser(data: { name: string; email: string; password_input: string; phone?: string; }): { success: boolean; user?: User, error?: string } {
    const users = getUsers();
    const existingUser = users.find(u => u.email === data.email);

    if (existingUser) {
        return { success: false, error: 'البريد الإلكتروني مسجل بالفعل.' };
    }

    const newId = (users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0) + 1;
    const newUser: User = {
        id: newId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'user', // All new signups are 'user'
        createdAt: new Date().toISOString(),
    };
    
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    const passwords = getUserPasswords();
    passwords[newId] = data.password_input;
    saveUserPasswords(passwords);

    return { success: true, user: newUser };
}
