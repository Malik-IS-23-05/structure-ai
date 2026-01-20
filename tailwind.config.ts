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
        background: "var(--background)", // Берет цвет из globals.css
        foreground: "var(--foreground)", // Берет цвет из globals.css
        // Твой фирменный фиолетовый цвет
        primary: {
          DEFAULT: "#8b5cf6", // Класс: bg-primary или text-primary
          hover: "#7c3aed",   // Класс: hover:bg-primary-hover
          foreground: "#ffffff" // Цвет текста на фиолетовом фоне
        }
      },
    },
  },
  plugins: [],
};
export default config;