"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    question: "Это сервис полностью бесплатный?",
    answer: "Да, базовый функционал генерации полностью бесплатен. Мы используем эффективные модели ИИ, чтобы предоставлять доступ всем желающим."
  },
  {
    question: "Можно ли сохранить результат?",
    answer: "Да, вы можете экспортировать схему в формате PNG или SVG"
  },
  {
    question: "Как работает генерация схем?",
    answer: "Мы используем синтаксис Mermaid.js. ИИ анализирует вашу тему, разбивает её на логические связи и пишет код, который браузер превращает в красивый график."
  }
];

export const FAQ = () => {
  const { isFocusMode } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {!isFocusMode && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, overflow: "hidden" }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto mt-20"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Часто задаваемые вопросы</h2>
          <div className="space-y-4">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="border border-border rounded-xl bg-card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
                >
                  {q.question}
                  <ChevronDown
                    className={cn(
                      "transition-transform duration-200 text-muted-foreground",
                      openIndex === i && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-muted-foreground text-sm leading-relaxed border-t border-border/50">
                        {q.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};