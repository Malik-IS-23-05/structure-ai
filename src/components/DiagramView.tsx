"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, RotateCcw, Download, Check } from "lucide-react";
import { toPng } from "html-to-image"; // <--- Импорт для скачивания

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    primaryColor: "#8b5cf6", // Наш фиолетовый
    edgeLabelBackground: "#ffffff",
    tertiaryColor: "#f3f4f6",
  },
  securityLevel: "loose",
});

interface DiagramViewProps {
  code: string;
}

export const DiagramView = ({ code }: DiagramViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null); // <--- Ссылка на обертку для захвата картинки
  const [scale, setScale] = useState(1);
  const [isRendered, setIsRendered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // <--- Состояние загрузки

  useEffect(() => {
    if (containerRef.current) {
      // Уникальный ID для каждого рендера
      const id = `mermaid-${Date.now()}`;
      
      mermaid.render(id, code).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          setIsRendered(true);
        }
      }).catch((error) => {
        console.error("Mermaid error:", error);
        if (containerRef.current) {
            containerRef.current.innerHTML = "<p class='text-red-500'>Ошибка рендера схемы</p>";
        }
      });
    }
  }, [code]);

  // Функции управления масштабом
  const handleZoomIn = () => setScale((p) => Math.min(p + 0.2, 3));
  const handleZoomOut = () => setScale((p) => Math.max(p - 0.2, 0.5));
  const handleReset = () => setScale(1);

  // --- ЛОГИКА СКАЧИВАНИЯ ---
  const handleDownload = async () => {
    if (!wrapperRef.current) return;

    try {
      setIsDownloading(true);
      
      // Генерируем картинку из DOM-элемента
      const dataUrl = await toPng(wrapperRef.current, { 
        quality: 1.0, 
        backgroundColor: '#ffffff', // Белый фон, чтобы схема была читаемой (особенно в темной теме)
        style: {
           transform: 'scale(1)', // Сбрасываем зум при скачивании для четкости
        } 
      });

      // Создаем ссылку для скачивания и нажимаем на нее программно
      const link = document.createElement('a');
      link.download = 'structura-diagram.png';
      link.href = dataUrl;
      link.click();
      
    } catch (err) {
      console.error('Ошибка скачивания:', err);
    } finally {
      // Небольшая задержка, чтобы пользователь увидел реакцию интерфейса
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  return (
    <div className="relative w-full h-[500px] border border-border rounded-xl bg-slate-50 dark:bg-slate-900/50 overflow-hidden flex flex-col">
      
      {/* Панель инструментов */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button onClick={handleZoomIn} className="p-2 bg-background border rounded-lg shadow-sm hover:bg-accent text-foreground transition-colors" title="Увеличить">
          <ZoomIn size={20} />
        </button>
        <button onClick={handleZoomOut} className="p-2 bg-background border rounded-lg shadow-sm hover:bg-accent text-foreground transition-colors" title="Уменьшить">
          <ZoomOut size={20} />
        </button>
        <button onClick={handleReset} className="p-2 bg-background border rounded-lg shadow-sm hover:bg-accent text-foreground transition-colors" title="Сбросить масштаб">
          <RotateCcw size={20} />
        </button>
        
        {/* Кнопка скачивания */}
        <button 
          onClick={handleDownload} 
          disabled={!isRendered || isDownloading}
          className="p-2 bg-primary text-white border-primary border rounded-lg shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          title="Скачать PNG"
        >
          {isDownloading ? <Check size={20} /> : <Download size={20} />}
        </button>
      </div>

      {/* Контейнер для графа (Wrapper нужен для html-to-image) */}
      <div 
        ref={wrapperRef}
        className="w-full h-full flex items-center justify-center overflow-auto cursor-grab active:cursor-grabbing p-4 bg-white dark:bg-slate-900/50" 
      >
        <div 
            ref={containerRef} 
            style={{ 
                transform: `scale(${scale})`, 
                transformOrigin: "center",
                transition: "transform 0.2s ease-out" 
            }}
            className="mermaid-container"
        />
      </div>
    </div>
  );
};