"use client";

import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { Eye, EyeOff, Languages, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { isFocusMode, toggleFocusMode } = useStore();
  const [isDark, setIsDark] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Structura.ai
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFocusMode}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isFocusMode 
                ? "bg-primary/10 text-primary hover:bg-primary/20" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {isFocusMode ? <EyeOff size={18} /> : <Eye size={18} />}
            <span className="hidden sm:inline">
              {isFocusMode ? "Выйти из фокуса" : "Режим фокуса"}
            </span>
          </button>

          <div className="h-4 w-[1px] bg-border mx-2" />

          <button className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <Languages size={20} />
          </button>

          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </motion.header>
  );
};