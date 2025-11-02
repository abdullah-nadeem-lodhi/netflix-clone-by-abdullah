import { useState, FormEvent } from 'react';

interface RegisterFormProps {
  onSubmit: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      return;
    }

    await onSubmit(formData);
  };

  const isFormValid = formData.email && formData.password && formData.firstName && formData.lastName;

  return (
    <div className="bg-netflix-gray p-8 rounded-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="input-netflix w-full"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="input-netflix w-full"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="input-netflix w-full"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className="input-netflix w-full"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-xs text-netflix-light-gray">
        <p className="mb-2">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
        </p>
        <p>
          Learn more about how{' '}
          <a href="#" className="underline hover:text-netflix-white">
            your data is collected and used
          </a>.
        </p>
      </div>
    </div>
  );
}