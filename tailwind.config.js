/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fondo: "#F8F9FA",
          text: "#212529",
          textTwo: "#6C757D",
          primary: "#007AFF",
          secondary: "#22C55E",
          error: "#EF4444",
          border: "#E5E7EB",
      },
    },
  },
  plugins: [],
};