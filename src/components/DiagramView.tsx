"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { 
  ZoomIn, ZoomOut, RotateCcw, Download, 
  Image as ImageIcon, FileCode, Maximize2, Minimize2 // <--- Новые иконки
} from "lucide-react";
import { toPng, toSvg } from "html-to-image";
import { cn } from "@/lib/utils"; // <--- Добавь этот импорт, если его нет!

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
  const [downloadingFormat, setDownloadingFormat] = useState<'png' | 'svg' | null>(null);
  
  // 🔥 Состояние для полного экрана
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Обработчик клавиши ESC для выхода из фулскрина
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

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
            containerRef.current.innerHTML = "<p class='text-red-500 text-sm'>Ошибка рендера (попробуйте перегенерировать)</p>";
        }
      });
    }
  }, [code]);

  const handleZoomIn = () => setScale((p) => Math.min(p + 0.2, 5)); // Увеличил лимит зума до 5
  const handleZoomOut = () => setScale((p) => Math.max(p - 0.2, 0.5));
  const handleReset = () => setScale(1);

  const handleDownload = async (format: 'png' | 'svg') => {
    if (!wrapperRef.current) return;
    try {
      setDownloadingFormat(format);
      const options = { 
        quality: 1.0, 
        backgroundColor: '#ffffff',
        style: { transform: 'scale(1)' } 
      };
      const dataUrl = format === 'png' 
        ? await toPng(wrapperRef.current, options)
        : await toSvg(wrapperRef.current, options);

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
    <div 
      className={cn(
        "border border-border rounded-xl bg-card overflow-hidden flex flex-col transition-all duration-300",
        // Если фулскрин — фиксируем на весь экран поверх всего (z-50)
        isFullscreen ? "fixed inset-0 z-[100] w-screen h-screen rounded-none" : "relative w-full h-[500px]"
      )}
    >
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
        
        {/* Кнопка Фулскрина */}
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)} 
          className={cn(
            "p-2 border rounded-lg shadow-sm transition-colors",
            isFullscreen ? "bg-primary text-white border-primary" : "bg-background hover:bg-accent text-foreground"
          )}
          title={isFullscreen ? "Свернуть" : "На весь экран"}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>

        <div className="h-[1px] bg-border my-1" />

        <button 
          onClick={() => handleDownload('png')} 
          disabled={!isRendered || downloadingFormat !== null}
          className="p-2 bg-white text-gray-700 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
          title="Скачать PNG"
        >
          {downloadingFormat === 'png' ? <Download size={20} className="animate-bounce" /> : <ImageIcon size={20} />}
        </button>

        <button 
          onClick={() => handleDownload('svg')} 
          disabled={!isRendered || downloadingFormat !== null}
          className="p-2 bg-white text-gray-700 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
          title="Скачать SVG"
        >
          {downloadingFormat === 'svg' ? <Download size={20} className="animate-bounce" /> : <FileCode size={20} />}
        </button>
      </div>

      {/* Контейнер схемы:
         1. Убрали 'items-center justify-center' (они ломали скролл для больших схем).
         2. Добавили 'flex'.
      */}
      <div 
        ref={wrapperRef}
        className="w-full h-full overflow-auto flex p-4 bg-white dark:bg-slate-900/50 cursor-grab active:cursor-grabbing" 
      >
        <div 
            ref={containerRef} 
            // 🔥 m-auto — это магия CSS. 
            // Если схема маленькая — она встанет по центру. 
            // Если большая — margin станет 0, и появится скролл (верх схемы не обрежется).
            className="mermaid-container m-auto transition-transform duration-200 ease-out origin-top" 
            style={{ 
                transform: `scale(${scale})`, 
            }}
        />
      </div>
    </div>
  );
};