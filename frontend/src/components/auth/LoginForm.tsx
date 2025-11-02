import { useState, FormEvent } from 'react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email || !formData.password) {
      return;
    }

    await onSubmit(formData.email, formData.password);
  };

  return (
    <div className="bg-netflix-gray p-8 rounded-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email or phone number"
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
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input-netflix w-full"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center text-netflix-light-gray text-sm">
          <input
            type="checkbox"
            className="mr-2 w-4 h-4"
          />
          Remember me
        </label>

        <a href="#" className="text-netflix-light-gray text-sm hover:underline">
          Need help?
        </a>
      </div>
    </div>
  );
}