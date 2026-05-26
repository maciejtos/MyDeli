import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface DailyDataPoint {
  date: string;
  day: number;
  earnings: number;
  km: number;
  minutes: number;
  hourlyRate: number;
}

interface MonthlyChartsProps {
  dailyData: DailyDataPoint[];
  currency?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string | number;
  suffix?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, suffix }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value ?? 0;
    return (
      <div className="rounded-xl bg-popover border border-border px-3 py-2 shadow-xl">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Dzień {label}</p>
        <p className="text-sm font-extrabold text-popover-foreground">
          {val.toFixed(2)} {suffix}
        </p>
      </div>
    );
  }
  return null;
};

const MonthlyCharts: React.FC<MonthlyChartsProps> = ({
  dailyData,
  currency = "PLN",
}) => {
  if (dailyData.length === 0) {
    return (
      <Card className="border-border shadow-xl overflow-hidden bg-card rounded-3xl p-8 text-center animate-in fade-in duration-300">
        <CardContent className="flex flex-col items-center justify-center py-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-sm">
            <BarChart3 size={28} />
          </div>
          <h3 className="text-lg font-bold text-foreground">Brak danych do wykresów</h3>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-sm leading-relaxed mx-auto">
            Zarejestruj jazdy w tym miesiącu w Dzienniku, aby zobaczyć wizualne wykresy zarobków, stawek oraz przebytych kilometrów.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Earnings Bar Chart */}
      <Card className="border-border shadow-md bg-card md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Zarobki dzienne ({currency})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip suffix={currency} />} cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar
                  dataKey="earnings"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Rate Line Chart */}
      <Card className="border-border shadow-md bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Stawka godzinowa ({currency}/h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip suffix={`${currency}/h`} />} cursor={{ stroke: "hsl(var(--muted-foreground))" }} />
                <Line
                  type="monotone"
                  dataKey="hourlyRate"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--background))", stroke: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* KM Area Chart */}
      <Card className="border-border shadow-md bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Kilometry dziennie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="kmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip suffix="km" />} cursor={{ stroke: "hsl(var(--muted-foreground))" }} />
                <Area
                  type="monotone"
                  dataKey="km"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  fill="url(#kmGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(MonthlyCharts);
