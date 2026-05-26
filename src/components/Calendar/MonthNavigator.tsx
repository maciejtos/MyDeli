import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { getMonthName } from "../../lib/utils";
import { Button } from "@/components/ui/button";

const MonthNavigator: React.FC = () => {
  const { currentMonth, currentYear, prevMonth, nextMonth } = useAppStore();

  return (
    <div className="flex items-center justify-between mb-3 md:mb-4">
      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
        {getMonthName(currentMonth)} <span className="text-muted-foreground font-medium">{currentYear}</span>
      </h2>
      <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-full shadow-sm shrink-0">
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
