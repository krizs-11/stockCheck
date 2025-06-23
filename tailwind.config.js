// tailwind.config.js
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Adjust based on your project structure
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1E40AF", // Replace with your desired primary color
                secondary: "#F59E0B", // Replace with your desired secondary color
            },
            animation: {
                'progress-bar': 'shrink 3s linear forwards',
                'fade-in': 'fadeIn 0.3s ease-out',
            },
            keyframes: {
                shrink: {
                    '0%': { width: '100%' },
                    '100%': { width: '0%' },
                },
                fadeIn: {
                    from: { opacity: 0, transform: 'translateY(-10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
            },
        },

    },
    plugins: [],
};
