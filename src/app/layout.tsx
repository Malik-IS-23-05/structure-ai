import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- Самая важная строка! Она подключает Tailwind

// Настраиваем шрифт Inter с поддержкой кириллицы
const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Structura.ai",
  description: "Генератор дорожных карт и структурных схем на базе ИИ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}