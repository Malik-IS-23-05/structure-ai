"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";

export const Hero = () => {
  const { isFocusMode } = useStore();

  return (
    <AnimatePresence>
      {!isFocusMode && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0, overflow: "hidden" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-center justify-center pt-32 pb-10 text-center px-4"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6"
          >
            Преврати <span className="text-primary">хаос знаний</span> <br />
            в чёткую структуру
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Генератор дорожных карт и структурных схем на базе ИИ. 
            Просто введи тему, и мы разложим всё по полочкам.
          </motion.p>
        </motion.section>
      )}
    </AnimatePresence>
  );
};