/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        surface: '#1c1c1c',
        primary: '#3b82f6', // blue accent
        success: '#22c55e', // green positive
        danger: '#ef4444', // red negative/overdue
        text: '#f3f4f6', // white/gray text
        textMuted: '#9ca3af',
        border: '#2d2d2d'
      }
    },
  },
  plugins: [],
}
