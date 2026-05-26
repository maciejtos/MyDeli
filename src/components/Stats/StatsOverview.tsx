import React from "react";
import {
  DollarSign,
  MapPin,
  Clock,
  Calendar,
  TrendingUp,
  Award,
  Bike,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatWorkTime, formatDate } from "../../lib/utils";
import type { MonthStats } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

interface StatsOverviewProps {
  current: MonthStats;
  previous: MonthStats;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  accentColor?: string; // tailwind color class base e.g. "emerald", "blue"
  iconBg: string;
  iconText: string;
  accentBar: string;
  subtitle?: string;
  trend?: number;
  featured?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBg,
  iconText,
  accentBar,
  subtitle,
  trend,
  featured,
}) => {
  return (
    <Card className={cn(
      "border-border bg-card shadow-md overflow-hidden relative group rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl",
      featured && "md:col-span-2 border-amber-500/30"
    )}>
      {/* Colored top accent bar — always visible */}
      <div className={cn("absolute top-0 inset-x-0 h-0.5", accentBar)} />
      
      <CardContent className={cn("p-3.5 sm:p-4", featured && "flex items-center gap-4")}>
        {featured ? (
          <>
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm", iconBg, iconText)}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{title}</p>
              <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight truncate">{value}</h3>
              {subtitle && <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground mt-0.5 truncate italic">{subtitle}</p>}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2.5">
              <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shadow-sm", iconBg, iconText)}>
                {icon}
              </div>
              {trend !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    trend > 0 
                      ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" 
                      : trend < 0 
                        ? "bg-red-500/12 text-red-500 dark:text-red-400" 
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {trend > 0 ? (
                    <ArrowUpRight size={10} className="shrink-0" />
                  ) : trend < 0 ? (
                    <ArrowDownRight size={10} className="shrink-0" />
                  ) : null}
                  {trend > 0 ? "+" : ""}
                  {trend.toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
            <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight leading-tight">{value}</h3>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ current, previous }) => {
  const { currency } = useAppStore();

  const calcTrend = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {/* Row 1: Key metrics — each with distinct color */}
      <StatCard
        title="Zarobki"
        value={`${current.totalEarnings.toFixed(2)} ${currency}`}
        icon={<DollarSign size={18} />}
        iconBg="bg-emerald-500/12"
        iconText="text-emerald-600 dark:text-emerald-400"
        accentBar="bg-emerald-500"
        trend={calcTrend(current.totalEarnings, previous.totalEarnings)}
      />
      <StatCard
        title="Dystans"
        value={`${current.totalKm.toFixed(1)} km`}
        icon={<MapPin size={18} />}
        iconBg="bg-blue-500/12"
        iconText="text-blue-600 dark:text-blue-400"
        accentBar="bg-blue-500"
        trend={calcTrend(current.totalKm, previous.totalKm)}
      />
      <StatCard
        title="Czas pracy"
        value={formatWorkTime(current.totalMinutes)}
        icon={<Clock size={18} />}
        iconBg="bg-violet-500/12"
        iconText="text-violet-600 dark:text-violet-400"
        accentBar="bg-violet-500"
        trend={calcTrend(current.totalMinutes, previous.totalMinutes)}
      />
      <StatCard
        title="Dni pracy"
        value={current.workDays.toString()}
        icon={<Calendar size={18} />}
        iconBg="bg-orange-500/12"
        iconText="text-orange-600 dark:text-orange-400"
        accentBar="bg-orange-500"
        trend={calcTrend(current.workDays, previous.workDays)}
      />

      {/* Row 2: Derived metrics */}
      <StatCard
        title="Stawka/h"
        value={`${current.avgHourlyRate.toFixed(2)} ${currency}`}
        icon={<TrendingUp size={18} />}
        iconBg="bg-teal-500/12"
        iconText="text-teal-600 dark:text-teal-400"
        accentBar="bg-teal-500"
        trend={calcTrend(current.avgHourlyRate, previous.avgHourlyRate)}
      />
      <StatCard
        title="Śr. dniówka"
        value={`${current.avgDailyEarnings.toFixed(2)} ${currency}`}
        icon={<Bike size={18} />}
        iconBg="bg-pink-500/12"
        iconText="text-pink-600 dark:text-pink-400"
        accentBar="bg-pink-500"
        trend={calcTrend(current.avgDailyEarnings, previous.avgDailyEarnings)}
      />

      {/* Featured: Best Day — spans 2 cols on desktop */}
      {current.bestDay ? (
        <StatCard
          title="🏆 Rekord dnia"
          value={`${current.bestDay.earnings.toFixed(2)} ${currency}`}
          subtitle={formatDate(current.bestDay.date)}
          icon={<Award size={22} />}
          iconBg="bg-amber-500/15"
          iconText="text-amber-600 dark:text-amber-400"
          accentBar="bg-gradient-to-r from-amber-400 to-amber-600"
          featured
        />
      ) : (
        <StatCard
          title="Rekord dnia"
          value={`0.00 ${currency}`}
          subtitle="Brak danych"
          icon={<Award size={22} />}
          iconBg="bg-amber-500/15"
          iconText="text-amber-600 dark:text-amber-400"
          accentBar="bg-amber-500/40"
          featured
        />
      )}
    </div>
  );
};

export default React.memo(StatsOverview);
