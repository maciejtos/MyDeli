import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  currentYear: number;
  currentMonth: number;
  selectedDate: string | null;
  theme: "dark" | "light";
  themePreset: "lavender" | "emerald" | "sunset";
  currency: string;
  monthlyEarningsGoal: number;
  monthlyKmGoal: number;
  displayName: string;
  isAddRideOpen: boolean;

  setCurrentMonth: (year: number, month: number) => void;
  setAddRideOpen: (open: boolean) => void;
  setSelectedDate: (date: string | null) => void;
  setTheme: (theme: "dark" | "light") => void;
  setThemePreset: (preset: "lavender" | "emerald" | "sunset") => void;
  setCurrency: (currency: string) => void;
  setMonthlyEarningsGoal: (goal: number) => void;
  setMonthlyKmGoal: (goal: number) => void;
  setDisplayName: (name: string) => void;
  nextMonth: () => void;
  prevMonth: () => void;
}

const now = new Date();

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth(),
      selectedDate: null,
      theme: "dark",
      themePreset: "lavender",
      currency: "PLN",
      monthlyEarningsGoal: 5000,
      monthlyKmGoal: 1000,
      displayName: "",
      isAddRideOpen: false,

      setCurrentMonth: (year, month) => set({ currentYear: year, currentMonth: month }),
      setAddRideOpen: (isAddRideOpen) => set({ isAddRideOpen }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setTheme: (theme) => set({ theme }),
      setThemePreset: (themePreset) => set({ themePreset }),
      setCurrency: (currency) => set({ currency }),
      setMonthlyEarningsGoal: (goal) => set({ monthlyEarningsGoal: goal }),
      setMonthlyKmGoal: (goal) => set({ monthlyKmGoal: goal }),
      setDisplayName: (name) => set({ displayName: name }),

      nextMonth: () =>
        set((state) => {
          const next = new Date(state.currentYear, state.currentMonth + 1, 1);
          return { currentYear: next.getFullYear(), currentMonth: next.getMonth() };
        }),

      prevMonth: () =>
        set((state) => {
          const prev = new Date(state.currentYear, state.currentMonth - 1, 1);
          return { currentYear: prev.getFullYear(), currentMonth: prev.getMonth() };
        }),
    }),
    {
      name: "mydeli-app-store",
    }
  )
);
