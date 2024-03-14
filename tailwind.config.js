/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'primary-bg': '#1984b1',
        'second-bg': '#395C9C',
        'popPrimary-bg': '#F15733',
        'popSecondary-bg': '#F0AA44',
      },
      fontFamily: {
        raleway: 'Raleway',
        EB_Garamond: ['EB Garamond', 'sans-serif'],
      },

      colors: {
        primaryColor: '#bfbfbf',
        secondColor: '#395C9C',
        popPrimary: '#F15733',
        popSecondary: '#F0AA44',
      },
      backgroundImage: {
        'main-gradient':
          'linear-gradient(to bottom right, #0D121B 0%,  #395C9C 30%, #1984b1 60%,  #0D121B 100%)',
        'secondary-gradient':
          'linear-gradient(to bottom right, #f8f8f8 0%, #f3f3f3 30%, #f5f5f5 60%, #f8f8f8 100%)',
        'neutral-gradient':
          'linear-gradient(to bottom right, #f8f8f8 0%, #f3f3f3 30%, #f5f5f5 60%, #f8f8f8 100%)',
      },
      screens: {
        maxxlg: {
          max: '1400px',
        },
        maxlg: {
          max: '1200px',
        },
        maxmd: {
          max: '960px',
        },
        maxmdsm: {
          max: '700px',
        },
        maxsm: {
          max: '521px',
        },
        maxxsm: {
          max: '420px',
        },
        maxxxs: {
          max: '374px',
        },
        minxlg: {
          min: '1400px',
        },
        minlg: {
          min: '1200px',
        },
        minmd: {
          min: '960px',
        },
        minmdsm: {
          min: '700px',
        },
        minsm: {
          min: '521px',
        },
        minxsm: {
          min: '420px',
        },
        minxxs: {
          min: '374px',
        },
      },
    },
  },
  plugins: [],
};
