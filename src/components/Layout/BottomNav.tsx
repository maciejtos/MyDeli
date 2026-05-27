import React from "react";
import { NavLink } from "react-router-dom";
import { CalendarDays, BarChart2, Settings, Plus, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAppStore } from "../../store/appStore";

const NAV_ITEMS = [
  { to: "/", icon: CalendarDays, label: "Dziennik" },
  { to: "/schedule", icon: CalendarClock, label: "Grafik" },
  { to: "/stats", icon: BarChart2, label: "Wyniki" },
  { to: "/settings", icon: Settings, label: "Ustawienia" },
];

const BottomNav: React.FC = () => {
  const { setAddRideOpen } = useAppStore();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center items-center gap-2 px-2 pointer-events-none">
      {/* Navigation menu */}
      <nav className="flex items-center gap-0.5 rounded-full border border-border bg-card/95 px-1 py-1 shadow-2xl backdrop-blur-xl pointer-events-auto transition-all duration-300">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center justify-center rounded-full w-15 sm:w-19 h-11 sm:h-13 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-lg shadow-primary/25"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <item.icon
                  size={16}
                  className={cn("mb-0.5 transition-transform duration-300", isActive ? "scale-110" : "scale-100")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[8px] sm:text-[9px] tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Floating Action Button (FAB) nested in the menu line */}
      <button
        type="button"
        onClick={() => setAddRideOpen(true)}
        className="h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/35 flex items-center justify-center pointer-events-auto active:scale-95 transition-transform duration-150 border border-primary/20 cursor-pointer shrink-0"
        aria-label="Dodaj jazdę"
      >
        <Plus size={20} className="sm:size-6" />
      </button>
    </div>
  );
};

export default BottomNav;
