import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalculationResult } from '../types/calculator';

export interface HistoryItem {
  id: string;
  calculatorId: string;
  inputs: Record<string, any>;
  result: CalculationResult;
  timestamp: number;
  isFavorite: boolean;
}

interface HistoryState {
  history: HistoryItem[];
  addHistory: (calculatorId: string, inputs: Record<string, any>, result: CalculationResult) => void;
  toggleFavorite: (id: string) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addHistory: (calculatorId, inputs, result) => set((state) => {
        const newItem: HistoryItem = {
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          calculatorId,
          inputs,
          result,
          timestamp: Date.now(),
          isFavorite: false,
        };
        // Keep last 100 items
        const newHistory = [newItem, ...state.history].slice(0, 100);
        return { history: newHistory };
      }),
      toggleFavorite: (id) => set((state) => ({
        history: state.history.map(item => 
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      })),
      removeHistory: (id) => set((state) => ({
        history: state.history.filter(item => item.id !== id)
      })),
      clearHistory: () => set({ history: [] })
    }),
    {
      name: 'smart-calc-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
