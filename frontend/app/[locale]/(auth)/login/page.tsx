'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/lib/api';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LoginPage() {
  const translations = useTranslations();
  const router = useRouter();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(usernameOrEmail, password);
      localStorage.setItem('token', res.data.access_token);
      router.push('/tasks');
    } catch {
      setError(translations('LOGIN_ERROR'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">{translations('LOGIN_TITLE')}</h1>

        {error && <p className="mb-4 text-sm text-red-600 bg-red-50 rounded p-2 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{translations('USERNAME_OR_EMAIL')}</label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{translations('PASSWORD')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-hover disabled:opacity-50">
            {loading ? translations('LOADING') : translations('LOGIN')}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          {translations('NO_ACCOUNT')}{' '}
          <Link href="/register" className="text-primary hover:underline">
            {translations('REGISTER')}
          </Link>
        </p>
      </div>
    </div>
  );
}
