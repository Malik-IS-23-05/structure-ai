import { create } from 'zustand';

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
} | null;

interface AppState {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  generatedData: GeneratedData;
  setGeneratedData: (data: GeneratedData) => void;
  viewMode: 'roadmap' | 'diagram';
  setViewMode: (mode: 'roadmap' | 'diagram') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  isFocusMode: false,
  toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
  generatedData: null,
  setGeneratedData: (data) => set({ generatedData: data }),
  viewMode: 'roadmap',
  setViewMode: (mode) => set({ viewMode: mode }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));