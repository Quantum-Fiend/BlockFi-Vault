/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0A192F',
                foreground: '#F8FAFC',
                primary: {
                    DEFAULT: '#64FFDA',
                    dark: '#00D1B2',
                },
                secondary: {
                    DEFAULT: '#BD93F9',
                    dark: '#9A66FF',
                },
                accent: '#FF79C6',
                card: 'rgba(17, 34, 64, 0.7)',
                border: 'rgba(100, 255, 218, 0.1)',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
