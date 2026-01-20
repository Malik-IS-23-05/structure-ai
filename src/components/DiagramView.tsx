"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, RotateCcw, Download, Image as ImageIcon, FileCode } from "lucide-react"; // <--- Добавили иконки
import { toPng, toSvg } from "html-to-image"; // <--- Импортировали toSvg

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    primaryColor: "#8b5cf6",
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isRendered, setIsRendered] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'png' | 'svg' | null>(null); // <--- Состояние теперь хранит формат

  useEffect(() => {
    if (containerRef.current) {
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

  const handleZoomIn = () => setScale((p) => Math.min(p + 0.2, 3));
  const handleZoomOut = () => setScale((p) => Math.max(p - 0.2, 0.5));
  const handleReset = () => setScale(1);

  // 🔥 УНИВЕРСАЛЬНАЯ ФУНКЦИЯ СКАЧИВАНИЯ
  const handleDownload = async (format: 'png' | 'svg') => {
    if (!wrapperRef.current) return;

    try {
      setDownloadingFormat(format);
      
      const options = { 
        quality: 1.0, 
        backgroundColor: '#ffffff',
        style: { transform: 'scale(1)' } 
      };

      let dataUrl;
      // Выбираем метод в зависимости от формата
      if (format === 'png') {
        dataUrl = await toPng(wrapperRef.current, options);
      } else {
        dataUrl = await toSvg(wrapperRef.current, options);
      }

      const link = document.createElement('a');
      link.download = `structura-diagram.${format}`;
      link.href = dataUrl;
      link.click();
      
    } catch (err) {
      console.error('Ошибка скачивания:', err);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 1000);
    }
  };

  return (
    <div className="relative w-full h-[500px] border border-border rounded-xl bg-card overflow-hidden flex flex-col">
      
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
        
        {/* Разделитель */}
        <div className="h-[1px] bg-border my-1" />

        {/* Кнопка PNG */}
        <button 
          onClick={() => handleDownload('png')} 
          disabled={!isRendered || downloadingFormat !== null}
          className="p-2 bg-white text-gray-700 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
          title="Скачать PNG"
        >
          {downloadingFormat === 'png' ? <Download size={20} className="animate-bounce" /> : <ImageIcon size={20} />}
        </button>

        {/* Кнопка SVG */}
        <button 
          onClick={() => handleDownload('svg')} 
          disabled={!isRendered || downloadingFormat !== null}
          className="p-2 bg-white text-gray-700 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
          title="Скачать SVG (Вектор)"
        >
          {downloadingFormat === 'svg' ? <Download size={20} className="animate-bounce" /> : <FileCode size={20} />}
        </button>
      </div>

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