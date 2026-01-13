/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'zegen-blue': '#1a2b4b', // Deep blue from image
                'zegen-red': '#d93a3a',  // Red accent
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
