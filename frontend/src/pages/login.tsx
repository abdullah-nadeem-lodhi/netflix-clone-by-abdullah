import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirect to home page or the page they were trying to access
      const redirectUrl = router.query.redirect as string || '/';
      router.push(redirectUrl);
    } catch (err) {
      // Error is handled by the useAuth hook
      console.error('Login failed:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - Netflix Clone</title>
        <meta name="description" content="Sign in to your Netflix Clone account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-netflix-white mb-8">Sign In</h1>
          </div>

          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />

          <div className="text-center space-y-4">
            <div className="text-netflix-white">
              New to Netflix?{' '}
              <Link href="/register" className="text-netflix-white hover:underline">
                Sign up now
              </Link>
            </div>

            <p className="text-netflix-light-gray text-sm">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}