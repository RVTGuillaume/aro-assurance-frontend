/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ✅ COULEURS OFFICIELLES ARO (VERT PRINCIPAL)
        aro: {
          green: '#006B5B',        // ✅ Vert principal ARO (du logo)
          darkGreen: '#004D40',    // Vert foncé
          lightGreen: '#26A69A',   // Vert clair
          blue: '#1E40AF',         // Bleu secondaire
          darkBlue: '#1E3A8A',     // Bleu foncé
          yellow: '#F59E0B',       // Jaune warning
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          }
        },
        primary: '#006B5B',      // ✅ Alias vert ARO (remplace rouge)
        secondary: '#1E40AF',    // Alias bleu ARO
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'aro': '0 4px 6px -1px rgba(0, 107, 91, 0.1), 0 2px 4px -1px rgba(0, 107, 91, 0.06)',
        'aro-lg': '0 10px 15px -3px rgba(0, 107, 91, 0.1), 0 4px 6px -2px rgba(0, 107, 91, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-green-100',
    'bg-green-50',
    'text-green-600',
    'text-green-700',
    'border-green-200',
    {
      pattern: /^(bg|text|border)-(green|blue|yellow|orange|red)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
  ],
}
