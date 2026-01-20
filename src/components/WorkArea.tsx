"use client";

import { RoadmapView } from "./RoadmapView";
import { DiagramView } from "./DiagramView";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, LayoutList, Network } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// --- ВРЕМЕННЫЕ МОКОВЫЕ ДАННЫЕ (ЧТОБЫ ТЕСТИТЬ БЕЗ API) ---
const MOCK_RESULT = {
  topic: "Как работает DNS",
  roadmap: [
    { step: 1, title: "Локальный кэш", description: "Браузер проверяет свой кэш.", resources: ["browser dns cache"] },
    { step: 2, title: "Hosts файл", description: "ОС проверяет файл hosts.", resources: ["hosts file"] },
    { step: 3, title: "DNS Резолвер", description: "Запрос уходит к провайдеру.", resources: ["ISP DNS"] },
  ],
  mermaid_code: `graph TD; A[User] --> B{Cache?}; B -- Yes --> C[IP Found]; B -- No --> D[Resolver];`
};

export const WorkArea = () => {
  const { 
    isLoading, setIsLoading, 
    generatedData, setGeneratedData,
    viewMode, setViewMode 
  } = useStore();
  
  const [input, setInput] = useState("");

const handleGenerate = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setGeneratedData(null); 
    
    try {
      // Реальный запрос к нашему API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: input }),
      });

      if (!response.ok) {
        throw new Error("Ошибка генерации");
      }

      const data = await response.json();
      setGeneratedData(data); // Сохраняем реальные данные от ИИ!
      
    } catch (error) {
      console.error(error);
      alert("Что-то пошло не так. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      
      {/* 1. Блок ввода */}
      <motion.div 
        layout
        className="relative flex items-center w-full"
      >
        <div className="relative w-full group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
          <div className="relative flex items-center bg-background rounded-xl p-2 border border-border shadow-2xl">
            <Sparkles className="ml-3 text-primary animate-pulse" size={24} />
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Что хочешь изучить? (например: 'Архитектура React', 'История Рима')"
              className="w-full bg-transparent border-none outline-none px-4 py-3 text-lg placeholder:text-muted-foreground/50"
            />

            <button
              onClick={handleGenerate}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>
                  <span className="hidden sm:inline">Сгенерировать</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Переключатель вкладок (Появляется только если есть данные) */}
      {generatedData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Заголовок темы */}
          <h2 className="text-3xl font-bold text-center">
            Разбор темы: <span className="text-primary">{generatedData.topic}</span>
          </h2>

          {/* Красивый Тумблер (Segmented Control) */}
          <div className="flex p-1 bg-muted rounded-xl self-center relative">
            {/* Кнопка Дорожная карта */}
            <button
              onClick={() => setViewMode('roadmap')}
              className={cn(
                "relative z-10 flex items-center gap-2 px-6 py-2 text-sm font-medium transition-colors duration-200",
                viewMode === 'roadmap' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutList size={18} />
              <span>Дорожная карта</span>
              {viewMode === 'roadmap' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>

            {/* Кнопка Схема */}
            <button
              onClick={() => setViewMode('diagram')}
              className={cn(
                "relative z-10 flex items-center gap-2 px-6 py-2 text-sm font-medium transition-colors duration-200",
                viewMode === 'diagram' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Network size={18} />
              <span>Схема</span>
              {viewMode === 'diagram' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          </div>

        {/* 3. Область контента */}
        <motion.div
        key={viewMode} // Ключ заставляет React пересоздавать анимацию при смене таба
        initial={{ opacity: 0, x: viewMode === 'roadmap' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-2xl p-1 sm:p-4"
        >
        {viewMode === 'roadmap' ? (
            <RoadmapView steps={generatedData.roadmap} />
        ) : (
            <DiagramView code={generatedData.mermaid_code} />
        )}
        </motion.div>
        </motion.div>
      )}
    </div>
  );
};