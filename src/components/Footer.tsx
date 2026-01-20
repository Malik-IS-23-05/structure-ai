"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";

export const Footer = () => {
  const { isFocusMode } = useStore();

  return (
    <AnimatePresence>
      {!isFocusMode && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full text-center py-8 mt-12 border-t border-border/40"
        >
          <p className="text-sm text-muted-foreground">
            © 2025 Structura.ai - Бесплатный инструмент для структурирования знаний.
          </p>
        </motion.footer>
      )}
    </AnimatePresence>
  );
};