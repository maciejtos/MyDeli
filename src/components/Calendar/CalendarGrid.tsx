import React, { useMemo } from "react";
import CalendarDay from "./CalendarDay";
import { getDaysInMonth, getFirstDayOfMonth, toDateString } from "../../lib/utils";
import { useAppStore } from "../../store/appStore";
import type { Ride } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  rides: Ride[];
  onDayClick: (dateStr: string) => void;
}

const DAY_HEADERS = [
  { label: "Pn", isWeekend: false, isSunday: false },
  { label: "Wt", isWeekend: false, isSunday: false },
  { label: "Śr", isWeekend: false, isSunday: false },
  { label: "Cz", isWeekend: false, isSunday: false },
  { label: "Pt", isWeekend: false, isSunday: false },
  { label: "Sb", isWeekend: true, isSunday: false },
  { label: "Nd", isWeekend: true, isSunday: true },
];

const CalendarGrid: React.FC<CalendarGridProps> = ({ rides, onDayClick }) => {
  const { currentYear, currentMonth } = useAppStore();

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const dateStr = toDateString(dateObj);
      const dayOfWeek = dateObj.getDay(); // 0=Sunday, 6=Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isSunday = dayOfWeek === 0;
      const dayRides = rides.filter((r) => r.date === dateStr);
      days.push({ day: d, dateStr, dayRides, isWeekend, isSunday });
    }
    return days;
  }, [currentYear, currentMonth, rides]);

  return (
    <Card className="border-border shadow-md sm:shadow-xl overflow-hidden bg-card backdrop-blur-md rounded-2xl sm:rounded-3xl h-[calc(100dvh-11.5rem)] md:h-[calc(100dvh-8.5rem)] min-h-[460px] w-full">
      <CardContent className="p-1 sm:p-4 h-full flex flex-col">
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-2 shrink-0">
          {DAY_HEADERS.map((d) => (
            <div
              key={d.label}
              className={cn(
                "text-center text-[10px] uppercase font-bold tracking-widest py-1.5 rounded-lg",
                d.isSunday
                  ? "text-red-500 dark:text-red-400 bg-red-500/8"
                  : d.isWeekend
                    ? "text-primary/80 bg-primary/6"
                    : "text-muted-foreground bg-muted/40"
              )}
            >
              {d.label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr flex-1 pb-0.5">
          {calendarDays.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} className="h-full w-full" />;
            }
            return (
              <CalendarDay
                key={item.dateStr}
                day={item.day}
                dateStr={item.dateStr}
                rides={item.dayRides}
                isWeekend={item.isWeekend}
                isSunday={item.isSunday}
                onClick={() => onDayClick(item.dateStr)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarGrid;
