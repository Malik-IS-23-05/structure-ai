"use client";

import { RoadmapStep, GeneratedData } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ExternalLink, ZoomIn, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// --- Props ---
interface RoadmapViewProps {
  steps: RoadmapStep[];
  parentTopic?: string; // Тема родителя (для контекста запроса)
  onDeepDiveFetch?: (stepTitle: string, parentTopic: string) => Promise<GeneratedData | null>;
}

// === ПОД-КОМПОНЕНТ: ОДИН ШАГ (С ЛОГИКОЙ РАСКРЫТИЯ) ===
const RoadmapItem = ({ 
  step, 
  index, 
  parentTopic, 
  onDeepDiveFetch 
}: { 
  step: RoadmapStep; 
  index: number; 
  parentTopic: string;
  onDeepDiveFetch?: (s: string, p: string) => Promise<GeneratedData | null>;
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Открыт ли Deep Dive
  const [isLoading, setIsLoading] = useState(false);
  const [subData, setSubData] = useState<GeneratedData | null>(null); // Данные под-карты

  const handleDeepDiveClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Чтобы не кликать чекбокс
    
    // 1. Если уже открыто — просто закрываем (сворачиваем)
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    // 2. Если данные уже загружены раньше — просто показываем
    if (subData) {
      setIsExpanded(true);
      return;
    }

    // 3. Иначе — загружаем
    if (!onDeepDiveFetch) return;

    setIsLoading(true);
    try {
      const data = await onDeepDiveFetch(step.title, parentTopic);
      if (data) {
        setSubData(data);
        setIsExpanded(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative pl-8 sm:pl-12"
    >
      {/* Линия связи (вертикальная) */}
      <div className="absolute left-[0px] sm:left-[0px] top-6 bottom-[-2rem] w-px bg-border -z-10 last:hidden" />

      {/* Кружок чекбокса */}
      <button
        onClick={() => setIsCompleted(!isCompleted)}
        className={cn(
          "absolute -left-[9px] sm:-left-[11px] top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 transition-all flex items-center justify-center bg-background z-10",
          isCompleted ? "border-primary bg-primary text-white" : "border-muted-foreground/40 text-transparent"
        )}
      >
        {isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
      </button>

      {/* Карточка */}
      <div 
        className={cn(
          "group rounded-xl border transition-all duration-300 relative overflow-hidden",
          isCompleted 
            ? "bg-primary/5 border-primary/20 opacity-80" 
            : "bg-card border-border hover:border-primary/50",
          isExpanded ? "ring-2 ring-primary/20 shadow-lg" : "hover:shadow-md"
        )}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 
              onClick={() => setIsCompleted(!isCompleted)}
              className={cn(
                "font-bold text-lg cursor-pointer hover:text-primary transition-colors", 
                isCompleted && "line-through text-muted-foreground"
              )}
            >
              {step.step}. {step.title}
            </h3>
            
            {/* Кнопка Deep Dive */}
            {onDeepDiveFetch && (
              <button
                onClick={handleDeepDiveClick}
                disabled={isLoading}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap",
                  isExpanded 
                    ? "bg-primary text-white" 
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                title="Подробнее"
              >
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : isExpanded ? (
                  <>
                    <ChevronUp size={14} /> Свернуть
                  </>
                ) : (
                  <>
                    <ZoomIn size={14} /> Подробнее
                  </>
                )}
              </button>
            )}
          </div>
          
          <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
            {step.description}
          </p>

          {/* Ресурсы */}
          {step.resources && step.resources.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {step.resources.map((res, i) => (
                <a
                  key={i}
                  href={`https://www.google.com/search?q=${encodeURIComponent(res)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                >
                  {res}
                  <ExternalLink size={10} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* --- ВЛОЖЕННЫЙ КОНТЕНТ (DEEP DIVE) --- */}
        <AnimatePresence>
          {isExpanded && subData && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border bg-muted/30 overflow-hidden"
            >
              <div className="p-4 sm:p-6 pl-2 sm:pl-4">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-primary/80 uppercase tracking-wider pl-4">
                   <div className="w-1 h-4 bg-primary rounded-full" />
                   Углубление: {subData.topic}
                </div>
                
                {/* 🔥 РЕКУРСИЯ! Вызываем RoadmapView внутри RoadmapView */}
                <RoadmapView 
                  steps={subData.roadmap} 
                  parentTopic={subData.topic}
                  onDeepDiveFetch={onDeepDiveFetch} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// === ОСНОВНОЙ КОМПОНЕНТ ===
export const RoadmapView = ({ steps, parentTopic = "", onDeepDiveFetch }: RoadmapViewProps) => {
  return (
    <div className="relative border-l-2 border-border ml-4 sm:ml-6 space-y-6 py-4">
      {steps.map((step, index) => (
        <RoadmapItem 
          key={step.step} 
          index={index}
          step={step} 
          parentTopic={parentTopic}
          onDeepDiveFetch={onDeepDiveFetch}
        />
      ))}
    </div>
  );
};