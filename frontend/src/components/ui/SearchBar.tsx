import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onClear
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative transition-all duration-300 ${
      isFocused ? 'scale-105' : 'scale-100'
    }`}>
      <div className="relative">
        <MagnifyingGlassIcon
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
            isFocused ? 'text-netflix-red' : 'text-netflix-light-gray'
          }`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="input-netflix pl-10 pr-10 w-full md:w-96 transition-all duration-300"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-netflix-light-gray hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search suggestions could go here */}
      {isFocused && value && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-netflix-gray rounded-md shadow-lg z-50">
          <div className="p-4 text-netflix-light-gray text-sm">
            Press Enter to search for "{value}"
          </div>
        </div>
      )}
    </div>
  );
}