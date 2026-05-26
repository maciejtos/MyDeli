import React, { useMemo } from "react";
import MonthNavigator from "../components/Calendar/MonthNavigator";
import StatsOverview from "../components/Stats/StatsOverview";
import MonthlyCharts from "../components/Stats/MonthlyCharts";
import { useStats } from "../hooks/useStats";
import { useRides } from "../hooks/useRides";
import { useAppStore } from "../store/appStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StatsPage: React.FC = () => {
  const { currentYear, currentMonth } = useAppStore();
  const { getRidesByMonth } = useRides();
  
  const currentRides = useMemo(() => getRidesByMonth(currentYear, currentMonth), [getRidesByMonth, currentYear, currentMonth]);
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevRides = useMemo(() => getRidesByMonth(prevYear, prevMonth), [getRidesByMonth, prevYear, prevMonth]);

  const { stats: currentStats, dailyData } = useStats(currentRides);
  const { stats: previousStats } = useStats(prevRides);

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <MonthNavigator />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 p-1 bg-card border border-border backdrop-blur-md rounded-full shadow-lg mb-5 h-11 shrink-0">
          <TabsTrigger
            value="overview"
            className="rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md cursor-pointer h-full"
          >
            Przegląd
          </TabsTrigger>
          <TabsTrigger
            value="charts"
            className="rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md cursor-pointer h-full"
          >
            Wykresy
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <StatsOverview current={currentStats} previous={previousStats} />
        </TabsContent>
        <TabsContent value="charts" className="space-y-4">
          <MonthlyCharts dailyData={dailyData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsPage;
