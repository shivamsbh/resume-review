export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1a73e8',
          'blue-dark': '#1557b0',
          'blue-light': '#e8f0fe',
          red: '#ea4335',
          yellow: '#fbbc04',
          green: '#34a853',
          gray: {
            50: '#f8f9fa',
            100: '#f1f3f4',
            200: '#e8eaed',
            300: '#dadce0',
            400: '#bdc1c6',
            500: '#9aa0a6',
            600: '#80868b',
            700: '#5f6368',
            800: '#3c4043',
            900: '#202124',
          }
        }
      },
      fontFamily: {
        'google': ['Google Sans', 'Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'google': '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
        'google-lg': '0 2px 6px 2px rgba(60,64,67,.15), 0 1px 2px 0 rgba(60,64,67,.3)',
        'google-xl': '0 4px 8px 3px rgba(60,64,67,.15), 0 1px 3px 0 rgba(60,64,67,.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}

