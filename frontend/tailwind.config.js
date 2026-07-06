/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#182033',
        ocean: '#2563eb',
        violet: '#7c3aed',
        coral: '#f97364',
        mint: '#14b8a6'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(24, 32, 51, 0.12)'
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(circle at 20% 20%, rgba(37,99,235,.16), transparent 26%), radial-gradient(circle at 80% 0%, rgba(124,58,237,.14), transparent 28%), linear-gradient(135deg, #f8fbff 0%, #ffffff 52%, #fff7f5 100%)',
        'mesh-dark':
          'radial-gradient(circle at 20% 20%, rgba(37,99,235,.26), transparent 28%), radial-gradient(circle at 80% 0%, rgba(124,58,237,.22), transparent 30%), linear-gradient(135deg, #0f172a 0%, #111827 55%, #1f2937 100%)'
      }
    }
  },
  plugins: []
};
