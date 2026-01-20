import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // <--- Импортируем persist

export type RoadmapStep = {
  step: number;
  title: string;
  description: string;
  resources: string[];
};

export type GeneratedData = {
  topic: string;
  roadmap: RoadmapStep[];
  mermaid_code: string;
};

interface AppState {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  
  generatedData: GeneratedData | null;
  setGeneratedData: (data: GeneratedData | null) => void;
  
  viewMode: 'roadmap' | 'diagram';
  setViewMode: (mode: 'roadmap' | 'diagram') => void;
  
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // --- НОВЫЕ ПОЛЯ ДЛЯ ИСТОРИИ ---
  history: GeneratedData[];
  addToHistory: (data: GeneratedData) => void;
  removeFromHistory: (topic: string) => void;
  clearHistory: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isFocusMode: false,
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
      
      generatedData: null,
      setGeneratedData: (data) => set({ generatedData: data }),
      
      viewMode: 'roadmap',
      setViewMode: (mode) => set({ viewMode: mode }),
      
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // --- ЛОГИКА ИСТОРИИ ---
      history: [],
      addToHistory: (data) => set((state) => {
        // Удаляем дубликаты (если такая тема уже есть, мы ее поднимем наверх)
        const filtered = state.history.filter((item) => item.topic !== data.topic);
        // Добавляем новую в начало и храним только последние 10
        return { history: [data, ...filtered].slice(0, 10) };
      }),
      removeFromHistory: (topic) => set((state) => ({
        history: state.history.filter((item) => item.topic !== topic)
      })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'structura-storage', // Имя ключа в Local Storage
      // Мы сохраняем историю и текущую открытую схему, чтобы при F5 всё осталось на месте
      partialize: (state) => ({ 
        history: state.history, 
        generatedData: state.generatedData,
        viewMode: state.viewMode
      }), 
    }
  )
);