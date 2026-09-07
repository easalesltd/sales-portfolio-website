/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-fraunces)', 'Times New Roman', 'serif'],
        gbbo: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
        script: ['var(--font-caveat)', 'Caveat', 'cursive'],
      },
      colors: {
        cream: '#f6efe2',
        flour: '#fffaf2',
        canvas: '#f3e6cf',
        tent: { DEFAULT: '#24584b', dark: '#16382f' },
        raspberry: '#c23b5a',
        butter: '#f0c75e',
        rose: '#e8a0bf',
        icing: '#f7d6dc',
        mint: '#8ec9b5',
        chocolate: '#3d2b1f',
        ink: '#2b2118',
      },
    },
  },
  plugins: [],
} 