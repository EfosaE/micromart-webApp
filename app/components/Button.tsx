// @/app/components/Button.ts
import type { ButtonHTMLAttributes, ReactElement } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'submit' | 'reset' | 'button'; // Match the original type
  label: string | ReactElement;
  styles?: string[];
}

export function Button({ label, type, styles = [], ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`text-white bg-secondary hover:bg-tertiary font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed capitalize ${styles.join(
        ' '
      )}`}
      {...props}>
      {label}
    </button>
  );
}
