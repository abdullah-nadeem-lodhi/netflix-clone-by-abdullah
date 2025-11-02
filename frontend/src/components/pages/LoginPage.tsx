import { useState, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../auth/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirect to home page or the page they were trying to access
      const redirectUrl = searchParams.get('redirect') || '/';
      navigate(redirectUrl);
    } catch (err) {
      // Error is handled by the useAuth hook
      console.error('Login failed:', err);
    }
  };

  return (
    <>
      <title>Sign In - Netflix Clone</title>
      <meta name="description" content="Sign in to your Netflix Clone account" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

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
              <a href="/register" className="text-netflix-white hover:underline">
                Sign up now
              </a>
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