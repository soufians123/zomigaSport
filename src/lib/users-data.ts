import type { User } from '@/types';

export const initialUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'soufiansoufiane19900@gmail.com',
    phone: '0500000000',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

// This is a separate map for passwords.
// WARNING: Storing plaintext passwords is not secure. This is for prototype purposes only.
export const initialUserPasswords: Record<number, string> = {
    1: '123456789'
};
