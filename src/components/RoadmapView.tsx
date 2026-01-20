"use client";

import { RoadmapStep } from "@/store/useStore";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RoadmapViewProps {
  steps: RoadmapStep[];
}

export const RoadmapView = ({ steps }: RoadmapViewProps) => {
  // Храним состояние чекбоксов (ID выполненных шагов)
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
            transition={{ delay: index * 0.1 }} // Каскадная анимация
            className="relative pl-8 sm:pl-12"
          >
            {/* Кружок на линии */}
            <button
              onClick={() => toggleStep(step.step)}
              className={cn(
                "absolute -left-[9px] sm:-left-[11px] top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 transition-all flex items-center justify-center bg-background z-10",
                isDone ? "border-primary bg-primary text-white" : "border-muted-foreground/40 text-transparent"
              )}
            >
              {isDone ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            </button>

            {/* Карточка контента */}
            <div 
              onClick={() => toggleStep(step.step)}
              className={cn(
                "group rounded-xl border p-4 sm:p-5 transition-all cursor-pointer hover:shadow-md",
                isDone 
                  ? "bg-primary/5 border-primary/20 opacity-70" 
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={cn("font-bold text-lg", isDone && "line-through text-muted-foreground")}>
                  {step.step}. {step.title}
                </h3>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {step.description}
              </p>

              {/* Ресурсы (теги) */}
              {step.resources && step.resources.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {step.resources.map((res, i) => (
                    <a
                      key={i}
                      href={`https://www.google.com/search?q=${encodeURIComponent(res)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // Чтобы клик не переключал чекбокс
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/50 text-xs font-medium text-accent-foreground hover:bg-primary/10 hover:text-primary transition-colors"
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