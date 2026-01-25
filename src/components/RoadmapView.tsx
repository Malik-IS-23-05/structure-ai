"use client";

import { RoadmapStep } from "@/store/useStore";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ExternalLink, ZoomIn } from "lucide-react"; // <--- Добавили ZoomIn
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RoadmapViewProps {
  steps: RoadmapStep[];
  onDeepDive?: (stepTitle: string) => void; // <--- Новый проп для Deep Dive
}

export const RoadmapView = ({ steps, onDeepDive }: RoadmapViewProps) => {
  const [completed, setCompleted] = useState<number[]>([]);

  const toggleStep = (stepId: number) => {
    setCompleted((prev) => 
      prev.includes(stepId) 
        ? prev.filter((id) => id !== stepId) 
        : [...prev, stepId]
    );
  };

  return (
    <div className="relative border-l-2 border-border ml-4 sm:ml-6 space-y-8 py-4">
      {steps.map((step, index) => {
        const isDone = completed.includes(step.step);

        return (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-8 sm:pl-12"
          >
            {/* Кружок чекбокса */}
            <button
              onClick={() => toggleStep(step.step)}
              className={cn(
                "absolute -left-[9px] sm:-left-[11px] top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 transition-all flex items-center justify-center bg-background z-10",
                isDone ? "border-primary bg-primary text-white" : "border-muted-foreground/40 text-transparent"
              )}
            >
              {isDone ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            </button>

            {/* Карточка */}
            <div 
              // Убрали onClick c дива, чтобы не путать клики
              className={cn(
                "group rounded-xl border p-4 sm:p-5 transition-all hover:shadow-md relative overflow-hidden",
                isDone 
                  ? "bg-primary/5 border-primary/20 opacity-70" 
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-start justify-between mb-2 gap-4">
                <h3 
                    onClick={() => toggleStep(step.step)}
                    className={cn("font-bold text-lg cursor-pointer hover:text-primary transition-colors", isDone && "line-through text-muted-foreground")}
                >
                  {step.step}. {step.title}
                </h3>
                
                {/* 🔥 КНОПКА DEEP DIVE (Показываем, если передана функция) */}
                {onDeepDive && (
                  <button
                    onClick={() => onDeepDive(step.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors whitespace-nowrap"
                    title="Сгенерировать подробный план для этого шага"
                  >
                    <ZoomIn size={14} />
                    <span className="hidden sm:inline">Подробнее</span>
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
          </motion.div>
        );
      })}
    </div>
  );
};