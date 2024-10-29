import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'jump-in': {
          '0%': { 
            transform: 'scale(0)',
            opacity: '0'
          },
          '50%': {
            transform: 'scale(1.1)'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        }
      },
      animation: {
        'jump-in': 'jump-in 1s ease-in forwards'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    }
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}

export default config;
