import { useMemo } from "react";
import type { Ride, MonthStats } from "../types";
import { calculateWorkMinutes } from "../lib/utils";

export function useStats(rides: Ride[]) {
  const stats = useMemo<MonthStats>(() => {
    if (rides.length === 0) {
      return {
        totalEarnings: 0,
        totalKm: 0,
        totalMinutes: 0,
        workDays: 0,
        avgHourlyRate: 0,
        avgDailyEarnings: 0,
        avgDailyKm: 0,
        bestDay: null,
      };
    }

    const dayMap = new Map<string, { earnings: number; km: number; minutes: number }>();

    for (const ride of rides) {
      const minutes = calculateWorkMinutes(ride.startTime, ride.endTime);
      const existing = dayMap.get(ride.date) || { earnings: 0, km: 0, minutes: 0 };
      dayMap.set(ride.date, {
        earnings: existing.earnings + ride.earnings,
        km: existing.km + ride.distanceKm,
        minutes: existing.minutes + minutes,
      });
    }

    const totalEarnings = rides.reduce((sum, r) => sum + r.earnings, 0);
    const totalKm = rides.reduce((sum, r) => sum + r.distanceKm, 0);
    const totalMinutes = rides.reduce(
      (sum, r) => sum + calculateWorkMinutes(r.startTime, r.endTime),
      0
    );
    const workDays = dayMap.size;

    let bestDay: { date: string; earnings: number } | null = null;
    for (const [date, data] of dayMap.entries()) {
      if (!bestDay || data.earnings > bestDay.earnings) {
        bestDay = { date, earnings: data.earnings };
      }
    }

    return {
      totalEarnings,
      totalKm,
      totalMinutes,
      workDays,
      avgHourlyRate: totalMinutes > 0 ? totalEarnings / (totalMinutes / 60) : 0,
      avgDailyEarnings: workDays > 0 ? totalEarnings / workDays : 0,
      avgDailyKm: workDays > 0 ? totalKm / workDays : 0,
      bestDay,
    };
  }, [rides]);

  const dailyData = useMemo(() => {
    const dayMap = new Map<string, { earnings: number; km: number; minutes: number }>();

    for (const ride of rides) {
      const minutes = calculateWorkMinutes(ride.startTime, ride.endTime);
      const existing = dayMap.get(ride.date) || { earnings: 0, km: 0, minutes: 0 };
      dayMap.set(ride.date, {
        earnings: existing.earnings + ride.earnings,
        km: existing.km + ride.distanceKm,
        minutes: existing.minutes + minutes,
      });
    }

    return Array.from(dayMap.entries())
      .map(([date, data]) => ({
        date,
        day: parseInt(date.split("-")[2]),
        earnings: data.earnings,
        km: data.km,
        minutes: data.minutes,
        hourlyRate: data.minutes > 0 ? data.earnings / (data.minutes / 60) : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [rides]);

  return { stats, dailyData };
}
