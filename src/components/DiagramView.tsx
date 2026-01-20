"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";

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
  const [scale, setScale] = useState(1);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      // Уникальный ID для каждого рендера, чтобы Mermaid не путался
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

  return (
    <div className="relative w-full h-[500px] border border-border rounded-xl bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      
      {/* Панель инструментов */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button onClick={handleZoomIn} className="p-2 bg-background border rounded-lg shadow-sm hover:bg-accent text-foreground">
          <ZoomIn size={20} />
        </button>
        <button onClick={handleZoomOut} className="p-2 bg-background border rounded-lg shadow-sm hover:bg-accent text-foreground">
          <ZoomOut size={20} />
        </button>
        <button onClick={handleReset} className="p-2 bg-background border rounded-lg shadow-sm hover:bg-accent text-foreground">
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Контейнер для графа */}
      <div 
        className="w-full h-full flex items-center justify-center overflow-auto cursor-grab active:cursor-grabbing p-4"
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