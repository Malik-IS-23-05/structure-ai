"use client";

import { useStore, GeneratedData } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, LayoutList, Network, Clock, 
  Trash2, RotateCcw, Code, GraduationCap, Palette
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RoadmapView } from "./RoadmapView";
import { DiagramView } from "./DiagramView";

// --- КОНФИГУРАЦИЯ МОДЕЛЕЙ ---
const MODELS = [
  { id: 'universal', name: 'Универсальный', icon: Sparkles, color: 'text-yellow-500' },
  { id: 'dev', name: 'Программист', icon: Code, color: 'text-blue-500' },
  { id: 'academic', name: 'Академик', icon: GraduationCap, color: 'text-green-500' },
  { id: 'creative', name: 'Креатив', icon: Palette, color: 'text-pink-500' },
];

// --- СТОКОВЫЕ ЗАПРОСЫ ---
const SUGGESTIONS = [
  "Python с нуля",
  "История Рима",
  "Как работает Blockchain",
  "Основы Маркетинга"
];

export const WorkArea = () => {
  const { 
    isLoading, setIsLoading, 
    generatedData, setGeneratedData,
    viewMode, setViewMode,
    history, addToHistory, removeFromHistory, clearHistory
  } = useStore();
  
  const [input, setInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [selectedModel, setSelectedModel] = useState('universal');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGenerate = async (queryOverride?: string) => {
    const query = queryOverride || input;
    if (!query.trim()) return;

    if (queryOverride) setInput(queryOverride);

    setIsLoading(true);
    setGeneratedData(null); 
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: query,
          modelType: selectedModel
        }),
      });

      if (!response.ok) throw new Error("Ошибка генерации");

      const data = await response.json();
      setGeneratedData(data);
      addToHistory(data);
      
    } catch (error) {
      console.error(error);
      alert("Что-то пошло не так. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = (item: GeneratedData) => {
    setGeneratedData(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full mx-auto flex flex-col gap-8">
      
      {/* === БЛОК ПОИСКА (Узкий контейнер max-w-2xl) === */}
      <motion.div 
        layout 
        className="w-full max-w-2xl mx-auto flex flex-col gap-4" // <--- СУЗИЛИ ЗДЕСЬ
      >
        
        {/* 1. ВЫБОР МОДЕЛИ */}
        {!generatedData && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-2 mb-1"
          >
            {MODELS.map((model) => {
              const Icon = model.icon;
              const isSelected = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    isSelected 
                      ? "bg-primary/10 border-primary text-primary shadow-sm" 
                      : "bg-card border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon size={16} className={cn(isSelected ? "text-primary" : model.color)} />
                  {model.name}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* ПОЛЕ ВВОДА */}
        <div className="relative w-full group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
          <div className="relative flex items-center bg-background rounded-xl p-2 border border-border shadow-2xl">
            <Sparkles className="ml-3 text-primary animate-pulse" size={24} />
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Что хочешь изучить?"
              className="w-full bg-transparent border-none outline-none px-4 py-3 text-lg placeholder:text-muted-foreground/50"
            />

            <button
              onClick={() => handleGenerate()}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <ArrowRight size={20} />
              )}
            </button>
          </div>
        </div>

        {/* 2. СТОКОВЫЕ ЗАПРОСЫ */}
        {!generatedData && !isLoading && input.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-2 mt-1"
          >
            {SUGGESTIONS.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleGenerate(suggestion)}
                className="px-3 py-1.5 text-xs sm:text-sm bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground rounded-lg transition-colors border border-transparent hover:border-primary/20"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}

        {/* История (тоже внутри узкого контейнера) */}
        {isMounted && !generatedData && history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 border-t border-border/50 pt-6"
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Clock size={16} />
                Недавние запросы
              </h3>
              <button 
                onClick={clearHistory}
                className="text-xs text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} /> Очистить
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {history.map((item, i) => (
                <motion.div
                  key={item.topic + i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-primary/50 cursor-pointer transition-all shadow-sm"
                  onClick={() => handleRestore(item)}
                >
                  <span className="font-medium truncate pr-2 text-sm">{item.topic}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFromHistory(item.topic); }}
                      className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded text-muted-foreground"
                      title="Удалить"
                    >
                      <Trash2 size={14} />
                    </button>
                    <RotateCcw size={14} className="text-primary" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* === БЛОК РЕЗУЛЬТАТОВ (Широкий контейнер max-w-4xl) === */}
      <AnimatePresence mode="wait">
        {generatedData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-4xl mx-auto flex flex-col gap-6" // <--- ШИРОКИЙ ЗДЕСЬ
          >
            <div className="relative text-center">
              <button 
                onClick={() => setGeneratedData(null)}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors md:flex hidden"
                title="Вернуться к поиску"
              >
                <ArrowRight className="rotate-180" size={20} />
              </button>
              
              <h2 className="text-3xl font-bold">
                Разбор темы: <span className="text-primary">{generatedData.topic}</span>
              </h2>
            </div>

            <div className="flex p-1 bg-muted rounded-xl self-center relative">
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

            <motion.div
              key={viewMode}
              initial={{ opacity: 0, x: viewMode === 'roadmap' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl p-1 sm:p-4 border border-border"
            >
              {viewMode === 'roadmap' ? (
                <RoadmapView steps={generatedData.roadmap} />
              ) : (
                <DiagramView code={generatedData.mermaid_code} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};