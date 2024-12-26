import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      padding: '2rem',
      center: true,
    },

    extend: {
      colors: {
        primary: '#6b3db8', // Custom Primary Color (violet)
        secondary: '#8b5cf6',
        tertiary: '#9d66f0', // (light purple)
        orange: '#f6a65c', // Custom Secondary Color (warm orange)
      },
      fontFamily: {
        klee: ['"Klee One"', 'cursive'],
        sans: ['"Libre Franklin"', 'sans-serif'], // Set Libre Franklin as the default sans font
        space: ['"Space Grotesk"', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 10s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
