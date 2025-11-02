import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RegisterForm from '../auth/RegisterForm';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();

  const handleRegister = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      await register(userData);
      // Redirect to home page after successful registration
      navigate('/');
    } catch (err) {
      // Error is handled by the useAuth hook
      console.error('Registration failed:', err);
    }
  };

  return (
    <>
      <title>Sign Up - Netflix Clone</title>
      <meta name="description" content="Create your Netflix Clone account" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-netflix-white mb-8">Sign Up</h1>
          </div>

          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />

          <div className="text-center space-y-4">
            <div className="text-netflix-white">
              Already have an account?{' '}
              <a href="/login" className="text-netflix-white hover:underline">
                Sign in now
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