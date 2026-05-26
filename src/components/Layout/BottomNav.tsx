import React from "react";
import { NavLink } from "react-router-dom";
import { CalendarDays, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { to: "/", icon: CalendarDays, label: "Dziennik" },
  { to: "/stats", icon: BarChart2, label: "Wyniki" },
  { to: "/settings", icon: Settings, label: "Ustawienia" },
];

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-2 py-2 shadow-2xl backdrop-blur-xl pointer-events-auto transition-all duration-300">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center justify-center rounded-full w-20 h-14 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
                  size={20}
                  className={cn("mb-0.5 transition-transform duration-300", isActive ? "scale-110" : "scale-100")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
