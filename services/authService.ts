// This is a mock authentication service.
// In a real application, this would make an API call to a backend server
// to validate credentials and return a JWT or session token.
import type { User } from '../types';

const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@gois.com': {
    password: 'password123',
    user: { email: 'admin@gois.com', role: 'admin', name: 'Admin GOÍS' }
  },
  'marketing@gois.com': {
    password: 'password123',
    user: { email: 'marketing@gois.com', role: 'marketing', name: 'Equipe Marketing' }
  }
};

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const storedUser = mockUsers[email.toLowerCase()];
      if (storedUser && storedUser.password === password) {
        resolve(storedUser.user);
      } else {
        reject(new Error('Credenciais inválidas. Tente novamente.'));
      }
    }, 1000); // 1-second delay
  });
};
