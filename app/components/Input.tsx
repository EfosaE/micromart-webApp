import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error?: string;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
}

export function Input({
  name,
  label,
  showPassword,
  togglePasswordVisibility,
  error,
  ...rest
}: InputProps) {
  return (
    <div className='space-y-2'>
      <label
        htmlFor={name}
        className='block text-sm font-medium text-gray-700 capitalize'>
        {label}
      </label>
      {name === 'password' ? (
        <div className='relative'>
          <input
            id={name}
            name={name}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={`w-full rounded focus:ring-1 focus:outline-none focus:ring-secondary focus:border-secondary block p-2.5  border  ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-500'
            }`}
            {...rest}
          />
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-secondary'>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      ) : (
        <input
          id={name}
          name={name}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full rounded border p-2.5 focus:ring-1 focus:outline-none focus:ring-secondary focus:border-secondary block ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-500'
          }`}
          {...rest}
        />
      )}

      {error && (
        <p id={`${name}-error`} className='text-red-500 text-sm'>
          {error}
        </p>
      )}
    </div>
  );
}
