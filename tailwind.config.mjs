/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem'
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1264px',
    },
    fontSize: {
      xs: ['14px', '16px'],
      sm: ['16px', '20px'],
      md: ['18px', '26px'],
      base: ['22px', '27px'],
      lg: ['24px', '32px'],
      xl: ['32px', '38px'],
      '2xl': ['48px', '57px'],
      '3xl': ['72px', '79px'],
    },

    extend: {
      typography: {
        DEFAULT: {
          css: {
            h2: {
              fontWeight: 500,
            },
            p: {
              color: '#6e6e6e',
            },
            ul: {
              '> li': {
                color: '#6e6e6e',
                '&::marker': {
                  color: '#1E1E1E',
                },
              },
            },
            strong: {
              color: '#1E1E1E',
              fontWeight: 400,
            },
            blockquote: {
              fontStyle: 'normal',
            },
          },
        },
      },
      spacing: {
        25: '100px',
        30: '120px',
      },
      padding: {
        17: '75px',
        25: '100px',
        30: '120px',
        35: '140px',
        44: '180px',
      },
      transitionProperty: {
        height: 'height',
        'max-height': 'max-height',
      },
      backgroundImage: {
        steps: 'linear-gradient(180deg, #FFF 66.5%, rgba(255, 255, 255, 0.00) 100%)',
      },
      colors: {
        white: '#fff',
        black: '#1e1e1e',
        'black-2': '#292929',
        'black-3': '#141414',
        'gray-1': '#bcbcbc',
        'gray-2': '#9d9d9d',
        'gray-3': '#808080',
        'gray-4': '#6e6e6e',
        'gray-5': '#f8f8f8',
      },
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
        display: ['Metric', ...defaultTheme.fontFamily.sans],
        logo: ['Stix', ...defaultTheme.fontFamily.sans]
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
