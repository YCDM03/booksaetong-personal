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
        hover: '#CED7E3',
        danger: '#DC3545',
        success: '#28A745'
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
    },
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    gridTemplateColumns: {
      'custom-1': 'repeat(1, 250px)',
      'custom-2': 'repeat(2, 250px)',
      'custom-3': 'repeat(3, 250px)',
      'custom-4': 'repeat(4, 250px)',
    },
  },
  plugins: []
};
export default config;
