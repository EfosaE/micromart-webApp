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
        primary: '#8b5cf6', // Custom Primary Color (violet)
        secondary: '#818cf8', // Custom Secondary Color (indigo)
        tertiary: '#fb7185', // Custom Secondary Color (rose)
      },
      fontFamily: {
        klee: ['"Klee One"', 'cursive'],
        sans: ['"Libre Franklin"', 'sans-serif'], // Set Libre Franklin as the default sans font
        space: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
