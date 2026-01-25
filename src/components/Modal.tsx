"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  // Блокируем скролл страницы, когда окно открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Затемнение фона (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Само окно */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Шапка окна */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-muted/20">
                <h2 className="text-xl font-bold truncate pr-4">{title || "Подробности"}</h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Контент (с прокруткой) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-card">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};