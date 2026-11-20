/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          900: '#1F0B20',
          800: '#2A102A',
          700: '#3D153E',
          600: '#531B54',
          500: '#6E2570',
        },
        raspberry: {
          600: '#A41D4E',
          500: '#C72C61',
          400: '#D94B7C',
          300: '#E8749B',
          100: '#FCE7EE',
        },
        bordeaux: {
          900: '#3D0B18',
          800: '#5C1327',
          700: '#6E162A',
          600: '#841C34',
        },
        ivory: {
          50: '#FCFBF7',
          100: '#FAF7EE',
          200: '#F4EEDC',
          300: '#EDE4C9',
          400: '#E0D4B2',
        },
        butter: {
          300: '#FDEEAA',
          400: '#F9E498',
          500: '#F5DB78',
          600: '#E5C450',
        },
        pistachio: {
          300: '#C2DCBB',
          400: '#A8C69F',
          500: '#94B78A',
          600: '#7FA375',
        },
        cobalt: {
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
        },
        magenta: {
          500: '#B31B6E',
          600: '#9F1D64',
          700: '#831652',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Fraunces"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '4px 4px 0px rgba(42, 16, 42, 0.95)',
        'card-lg': '6px 6px 0px rgba(42, 16, 42, 0.95)',
        'card-xl': '8px 8px 0px rgba(42, 16, 42, 0.95)',
        'card-hover': '8px 8px 0px rgba(42, 16, 42, 1)',
        'card-deep': '10px 10px 0px #1F0B20',
        'subtle-card': '0 10px 30px -10px rgba(42, 16, 42, 0.15), 3px 3px 0px rgba(42, 16, 42, 0.9)',
      },
      borderRadius: {
        'card': '14px',
        'card-lg': '20px',
      }
    },
  },
  plugins: [],
}
