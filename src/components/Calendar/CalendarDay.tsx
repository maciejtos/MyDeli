import React from "react";
import type { Ride } from "../../types";
import { toDateString } from "../../lib/utils";
import { useAppStore } from "../../store/appStore";
import { cn } from "@/lib/utils";

interface CalendarDayProps {
  day: number;
  dateStr: string;
  rides: Ride[];
  isWeekend: boolean;
  isSunday: boolean;
  onClick: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, dateStr, rides, isWeekend, isSunday, onClick }) => {
  const { currency } = useAppStore();
  const isToday = dateStr === toDateString(new Date());
  
  const hasRides = rides.length > 0;
  const totalEarnings = rides.reduce((sum, r) => sum + r.earnings, 0);

  const intensity = Math.min(totalEarnings / 400, 1);
  const opacity = hasRides ? Math.max(0.15, intensity * 0.5) : 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-start h-full w-full rounded-lg sm:rounded-xl p-0.5 sm:p-1 md:p-1.5 transition-all duration-200",
        "border hover:scale-[1.03] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        // Today styling takes priority
        isToday 
          ? "border-primary bg-primary/8 ring-2 ring-primary/25 shadow-md shadow-primary/10" 
          // Weekend without rides
          : isWeekend && !hasRides
            ? "border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/30"
            // Regular day without rides
            : !hasRides
              ? "border-border bg-card hover:bg-accent/50 hover:border-primary/30"
              // Day with rides (not today)
              : "border-primary/35 bg-primary/4 hover:bg-primary/8",
      )}
    >
      {hasRides && (
        <div 
          className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/25 to-primary/8 pointer-events-none transition-opacity duration-300" 
          style={{ opacity }}
        />
      )}
      
      <span
        className={cn(
          "relative z-10 text-[10px] sm:text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full mt-0.5 transition-colors duration-200",
          isToday 
            ? "bg-primary text-primary-foreground font-extrabold shadow-sm shadow-primary/30"
            : isSunday
              ? "text-red-500 dark:text-red-400 font-bold"
              : isWeekend
                ? "text-primary/70 font-bold"
                : "text-foreground/90",
          hasRides && !isToday && !isSunday && "text-foreground font-extrabold"
        )}
      >
        {day}
      </span>
      
      {hasRides && (
        <div className="relative z-10 mt-auto pb-0.5 sm:pb-1 flex flex-col items-center">
          <span className="text-[9px] sm:text-xs md:text-sm font-extrabold text-foreground tracking-tight">
            {totalEarnings.toFixed(0)} <span className="text-[7px] sm:text-[9px] text-muted-foreground font-medium">{currency}</span>
          </span>
          {/* Extended Desktop-only Metrics */}
          <div className="hidden md:flex flex-col items-center gap-0.5 mt-1 text-[9px] text-muted-foreground font-bold tracking-tight">
            <span>{rides.reduce((sum, r) => sum + r.distanceKm, 0).toFixed(0)} km</span>
            <span className="text-[8px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-md mt-0.5 font-extrabold">{rides.length} {rides.length === 1 ? "jazda" : "jazdy"}</span>
          </div>
        </div>
      )}
    </button>
  );
};

export default CalendarDay;
