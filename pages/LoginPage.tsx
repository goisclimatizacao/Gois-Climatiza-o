import React, { useState } from 'react';
import { login } from '../services/authService';
import { goisLogoBase64 } from '../components/logo';
import type { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        
        <div className="bg-[#002060]">
            <div className="flex flex-col items-center justify-center py-8">
                <img src={goisLogoBase64} alt="GOÍS Climatização Logo" className="h-16 w-auto" />
            </div>
        </div>

        <div className="p-8 space-y-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
                Acesse o AI Content Studio
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700 sr-only">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-[#002060] focus:border-[#002060] focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Email (ex: admin@gois.com)"
                />
                </div>
                <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700 sr-only">
                    Senha
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-[#002060] focus:border-[#002060] focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Senha (ex: password123)"
                />
                </div>
            </div>
            
            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md dark:bg-red-900/30 dark:text-red-400 dark:border-red-500/50">
                    {error}
                </div>
            )}

            <div>
                <button
                type="submit"
                disabled={isLoading}
                className="group relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-[#002060] border border-transparent rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                {isLoading ? (
                    <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8-0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : 'Entrar'}
                </button>
            </div>
            </form>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                <p>Use `admin@gois.com` ou `marketing@gois.com`</p>
                <p>A senha para ambos é `password123`</p>
            </div>
        </div>
      </div>
    </div>
  );
};
