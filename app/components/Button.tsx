// @/app/components/Button.ts
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'submit' | 'reset' | 'button'; // Match the original type
  label: string;
}

export function AuthButton({ label, type, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className='text-white w-full bg-gradient-to-r from-primary via-secondary to-primary hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed '
      {...props}>
      {label}
    </button>
  );
}
export function AppButton({ label, type, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className='text-white w-fit bg-secondary hover:bg-tertiary font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed '
      {...props}>
      {label}
    </button>
  );
}