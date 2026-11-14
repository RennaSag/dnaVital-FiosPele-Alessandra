// Configuração do Tailwind.
// Depois de mudar classes no HTML/JS, rode "npm run build" para regenerar assets/css/tailwind.css.
// Paleta tirada do logo da Clínica DNA Vital: marinho #012C4C e azul #599FCB.
/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        marinho: {
          DEFAULT: '#012C4C',
          50: '#EEF5FA',
          100: '#DCEBF5',
          200: '#BCD8EC',
          300: '#8EBEDF',
          400: '#599FCB',
          500: '#2B6E9B',
          600: '#164F78',
          700: '#012C4C',
          800: '#01243F',
          900: '#011B30',
          950: '#011322'
        },
        nevoa: {
          clara: '#EAF2F8',
          DEFAULT: '#DCE9F3',
          escura: '#BFD5E6',
          dourada: '#A9D0EA'
        },
        celeste: {
          DEFAULT: '#2B6E9B',
          hover: '#1F5A82',
          claro: '#E1EEF8',
          vivo: '#599FCB'
        },
        textoEscuro: '#102A3F',
        textoSuave: '#3D5568'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  }
};

module.exports = {
  content: ['./index.html', './404.html', './assets/js/**/*.js'],
  ...config,
};
