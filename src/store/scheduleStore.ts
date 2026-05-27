import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Shift } from "../types";

interface ScheduleState {
  shifts: Shift[];
  addShift: (shift: Omit<Shift, "id">) => void;
  updateShift: (id: string, shift: Partial<Omit<Shift, "id">>) => void;
  deleteShift: (id: string) => void;
  getShiftsByDate: (date: string) => Shift[];
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      shifts: [],
      addShift: (shiftData) =>
        set((state) => ({
          shifts: [
            ...state.shifts,
            { ...shiftData, id: crypto.randomUUID() },
          ],
        })),
      updateShift: (id, shiftData) =>
        set((state) => ({
          shifts: state.shifts.map((s) =>
            s.id === id ? { ...s, ...shiftData } : s
          ),
        })),
      deleteShift: (id) =>
        set((state) => ({
          shifts: state.shifts.filter((s) => s.id !== id),
        })),
      getShiftsByDate: (date) => {
        return get().shifts.filter((s) => s.date === date);
      },
    }),
    {
      name: "mydeli-schedule-store",
    }
  )
);
