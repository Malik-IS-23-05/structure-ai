import type { Config } from "tailwindcss";

const config: Config = {
  // 1. CONTENT: Здесь мы говорим Tailwind, в каких файлах искать классы.
  // Если путь будет неправильным, стили просто не применятся.
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  // 2. DARK MODE: Включаем поддержку темной темы через класс (потребуется позже)
  darkMode: "class", 

  theme: {
    extend: {
      // 3. COLORS: Добавляем твои кастомные цвета
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",       // <--- Добавили
        muted: {                       // <--- Добавили
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: "var(--card)",           // <--- Добавили
        
        primary: {
          DEFAULT: "#8b5cf6",
          hover: "#7c3aed",
          foreground: "#ffffff"
        }
      },
    },
  },
  plugins: [],
};
export default config;