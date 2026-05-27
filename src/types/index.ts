import { Timestamp } from "firebase/firestore";

export interface Ride {
  id: string;
  date: string;           // "YYYY-MM-DD"
  startTime: string;      // "HH:MM"
  endTime: string;        // "HH:MM"
  earnings: number;       // PLN
  distanceKm: number;     // kilometry
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserSettings {
  displayName: string;
  currency: string;
  monthlyEarningsGoal: number;
  monthlyKmGoal: number;
  theme: "dark" | "light";
}

export interface MonthStats {
  totalEarnings: number;
  totalKm: number;
  totalMinutes: number;
  workDays: number;
  avgHourlyRate: number;
  avgDailyEarnings: number;
  avgDailyKm: number;
  bestDay: { date: string; earnings: number } | null;
}

export interface DayData {
  date: string;
  rides: Ride[];
  totalEarnings: number;
  totalKm: number;
  totalMinutes: number;
}

export interface Shift {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  targetKm?: number;
  targetEarnings?: number;
  targetHourlyRate?: number;
}
