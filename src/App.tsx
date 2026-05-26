import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useAppStore } from "./store/appStore";
import AppLayout from "./components/Layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import CalendarPage from "./pages/CalendarPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";

// Loading skeleton component
const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="mx-auto mb-4 h-16 w-16 rounded-2xl skeleton" />
      <div className="h-4 w-24 mx-auto skeleton mb-2" />
      <div className="h-3 w-32 mx-auto skeleton" />
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSkeleton />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const App: React.FC = () => {
  const { theme, themePreset } = useAppStore();

  React.useEffect(() => {
    // Clean up older classes
    document.documentElement.classList.remove("theme-lavender", "theme-emerald", "theme-sunset");
    // Add new theme class
    document.documentElement.classList.add(`theme-${themePreset || "lavender"}`);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, themePreset]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<CalendarPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
