import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        main: '#003069',
        sub: '#2E4FFB',
        hover: '#CED7E3'
      },
      boxShadow: {
        detail: '0px 0px 18px rgba(46, 79, 251, 0.15)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      keyframes: {
        shrink: {
          '0%': { width: '100%' },
          '100%': { width: '0%' }
        }
      },
      animation: {
        shrink: 'shrink 3s linear forwards'
      }
    }
  },
  plugins: []
};
export default config;
