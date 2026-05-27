import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { getMonthName } from "../../lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MonthNavigatorProps {
  title?: string;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({ title }) => {
  const { currentMonth, currentYear, prevMonth, nextMonth } = useAppStore();

  return (
    <div className="flex items-center justify-between mb-3 md:mb-4 gap-4 flex-wrap sm:flex-nowrap">
      <div className="flex items-baseline gap-2.5">
        {title && (
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight shrink-0">
            {title}
          </h1>
        )}
        {title && <span className="text-muted-foreground/30 font-light select-none">|</span>}
        <h2 className={cn(
          "font-black tracking-tight text-foreground",
          title ? "text-lg md:text-xl text-muted-foreground font-semibold" : "text-2xl md:text-3xl"
        )}>
          {getMonthName(currentMonth)} <span className="text-muted-foreground font-medium">{currentYear}</span>
        </h2>
      </div>
      <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-full shadow-sm shrink-0 ml-auto">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full cursor-pointer hover:bg-muted" onClick={prevMonth}>
          <ChevronLeft size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full cursor-pointer hover:bg-muted" onClick={nextMonth}>
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default MonthNavigator;
