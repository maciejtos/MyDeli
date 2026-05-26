import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import { CalendarDays, BarChart2, Settings, Bike } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { to: "/", icon: CalendarDays, label: "Dziennik" },
  { to: "/stats", icon: BarChart2, label: "Wyniki" },
  { to: "/settings", icon: Settings, label: "Ustawienia" },
];

const AppLayout: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background text-foreground antialiased selection:bg-primary/30 relative">
      {/* Dynamic ambient glowing orbs for premium aesthetics */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-chart-2/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/90 backdrop-blur-xl p-6 shrink-0 h-screen sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Bike size={20} />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">
            MyDeli
          </span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                  isActive
                    ? "text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktopActiveTab"
                    className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-lg shadow-primary/20"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        
        <div className="pt-6 border-t border-border/40 pl-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Aktualizacja: 1.0</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 w-full max-w-2xl md:max-w-5xl mx-auto px-4 md:px-8 pb-28 md:pb-12 pt-6">
          <Outlet />
        </main>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
