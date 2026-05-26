import React, { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRides } from "../hooks/useRides";
import { useAppStore } from "../store/appStore";
import { useStats } from "../hooks/useStats";
import {
  LogOut,
  User,
  Moon,
  Sun,
  Target,
  MapPin,
  Palette,
  Loader2,
  Lock,
  ChevronRight,
  Coins,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const THEMES = [
  { id: "lavender", name: "Aura Lavender", primary: "bg-[#6C63FF]", secondary: "bg-[#0A0A0F]" },
  { id: "emerald", name: "Emerald Deli", primary: "bg-[#10B981]", secondary: "bg-[#051C12]" },
  { id: "sunset", name: "Sunset Amber", primary: "bg-[#F59E0B]", secondary: "bg-[#180F0A]" },
] as const;

/* ── Reusable Settings Row ─────────────────────────── */
const SettingsRow: React.FC<{
  icon: React.ReactNode;
  iconBg?: string;
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  isLast?: boolean;
  expandable?: boolean;
  expanded?: boolean;
}> = ({ icon, iconBg = "bg-muted", label, sublabel, right, onClick, isLast, expandable, expanded }) => {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3.5 text-left transition-all duration-150",
        onClick ? "cursor-pointer hover:bg-muted/30 active:bg-muted/50 focus:outline-none" : "",
        !isLast && "border-b border-border/10"
      )}
    >
      <div className={cn("h-8.5 w-8.5 rounded-xl flex items-center justify-center shrink-0 shadow-sm", iconBg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-snug">{label}</p>
        {sublabel && <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">{sublabel}</p>}
      </div>
      {right && <div className="flex items-center shrink-0">{right}</div>}
      {expandable && (
        <ChevronRight
          size={14}
          className={cn(
            "text-muted-foreground shrink-0 transition-transform duration-200 ml-1",
            expanded && "rotate-90"
          )}
        />
      )}
    </Component>
  );
};

const SettingsPage: React.FC = () => {
  const { user, logout, changePassword } = useAuth();
  const { getRidesByMonth } = useRides();
  const {
    currentYear,
    currentMonth,
    theme,
    setTheme,
    themePreset,
    setThemePreset,
    currency,
    setCurrency,
    monthlyEarningsGoal,
    setMonthlyEarningsGoal,
    monthlyKmGoal,
    setMonthlyKmGoal,
  } = useAppStore();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const monthRides = useMemo(
    () => getRidesByMonth(currentYear, currentMonth),
    [getRidesByMonth, currentYear, currentMonth]
  );
  const { stats } = useStats(monthRides);

  const earningsProgress = monthlyEarningsGoal > 0
    ? Math.min((stats.totalEarnings / monthlyEarningsGoal) * 100, 100)
    : 0;
  const kmProgress = monthlyKmGoal > 0
    ? Math.min((stats.totalKm / monthlyKmGoal) * 100, 100)
    : 0;

  const isEmailUser = useMemo(() => {
    return user?.providerData.some((p) => p.providerId === "password") ?? false;
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (newPassword !== confirmPassword) {
      setPwError("Hasła nie są identyczne");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    setPwLoading(true);
    try {
      await changePassword(newPassword);
      setPwSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      let message = "Błąd zmiany hasła";
      if (err instanceof Error) {
        message = err.message;
        if ((err as { code?: string }).code === "auth/requires-recent-login") {
          message = "Ta operacja wymaga ponownego zalogowania ze względów bezpieczeństwa.";
        }
      }
      setPwError(message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Ustawienia</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* ── Left Column ────────────────────────────── */}
        <div className="space-y-4">

          {/* Profile row */}
          <div className="flex items-center gap-3 px-1 mb-1">
            <Avatar className="h-9 w-9 border border-border shadow-sm">
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                <User size={16} />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground truncate leading-tight">{user?.displayName || "Kurier"}</p>
              <p className="text-[11px] text-muted-foreground truncate leading-tight">{user?.email}</p>
            </div>
          </div>

          {/* Settings card */}
          <Card className="border-border bg-card shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">

              {/* Theme mode */}
              <SettingsRow
                icon={theme === "dark" ? <Moon size={15} className="text-indigo-400" /> : <Sun size={15} className="text-amber-500" />}
                iconBg={theme === "dark" ? "bg-indigo-500/12" : "bg-amber-500/12"}
                label="Motyw"
                sublabel={theme === "dark" ? "Ciemny" : "Jasny"}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                right={
                  <div className={cn(
                    "relative h-6 w-10 rounded-full transition-colors duration-300 flex items-center shrink-0",
                    theme === "dark" ? "bg-primary" : "bg-border"
                  )}>
                    <div className={cn(
                      "absolute h-4.5 w-4.5 rounded-full bg-white shadow transition-all duration-300",
                      theme === "dark" ? "left-[1.25rem]" : "left-[0.15rem]"
                    )} />
                  </div>
                }
              />

              {/* Color theme */}
              <SettingsRow
                icon={<Palette size={15} className="text-primary" />}
                iconBg="bg-primary/10"
                label="Kompozycja kolorów"
                sublabel={THEMES.find(t => t.id === themePreset)?.name || "Lavender"}
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                expandable
                expanded={showThemeSelector}
              />
              {showThemeSelector && (
                <div className="px-4 pt-1.5 pb-4 border-b border-border/10 bg-muted/10 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="grid grid-cols-3 gap-2">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setThemePreset(t.id)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200",
                          themePreset === t.id
                            ? "border-primary bg-primary/8 ring-1 ring-primary/30 shadow-sm"
                            : "border-border bg-background hover:bg-muted/40"
                        )}
                      >
                        <div className="flex -space-x-1">
                          <div className={cn("h-4.5 w-4.5 rounded-full border-2 border-background shadow-sm", t.primary)} />
                          <div className={cn("h-4.5 w-4.5 rounded-full border-2 border-background shadow-sm", t.secondary)} />
                        </div>
                        <span className="text-[10px] font-bold text-foreground/80">{t.name.split(" ")[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Currency */}
              <SettingsRow
                icon={<Coins size={15} className="text-amber-500" />}
                iconBg="bg-amber-500/12"
                label="Waluta"
                right={
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-28 rounded-lg border-border bg-background h-8 text-xs font-semibold shrink-0" onClick={(e) => e.stopPropagation()}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="PLN">PLN (zł)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                }
                isLast={!isEmailUser}
              />

              {/* Password */}
              {isEmailUser && (
                <>
                  <SettingsRow
                    icon={<Lock size={15} className="text-red-400" />}
                    iconBg="bg-red-500/10"
                    label="Zmień hasło"
                    sublabel="Bezpieczeństwo konta"
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                    expandable
                    expanded={showPasswordChange}
                    isLast
                  />
                  {showPasswordChange && (
                    <div className="px-4 pt-2.5 pb-4 space-y-3 bg-muted/10 animate-in slide-in-from-top-2 fade-in duration-200">
                      {pwError && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-600 dark:text-red-400 font-semibold animate-shake">
                          {pwError}
                        </div>
                      )}
                      {pwSuccess && (
                        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          Hasło zmienione pomyślnie!
                        </div>
                      )}
                      <form onSubmit={handlePasswordChange} className="space-y-3">
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                          placeholder="Nowe hasło (min. 6 znaków)"
                          required
                          minLength={6}
                          className="rounded-xl border-border bg-background h-9 text-sm focus-visible:ring-1"
                        />
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                          placeholder="Potwierdź nowe hasło"
                          required
                          minLength={6}
                          className="rounded-xl border-border bg-background h-9 text-sm focus-visible:ring-1"
                        />
                        <Button type="submit" disabled={pwLoading} className="w-full rounded-xl h-9 text-xs font-semibold shadow-sm transition-all active:scale-[0.98]">
                          {pwLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                          Zaktualizuj hasło
                        </Button>
                      </form>
                    </div>
                  )}
                </>
              )}

            </CardContent>
          </Card>



        </div>

        {/* ── Right Column: Goals ─────────────────────── */}
        <div className="space-y-4">
          {/* Combined Goals Card */}
          <Card className="border-border bg-card shadow-md rounded-2xl overflow-hidden">
            <CardContent className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2.5 border-b border-border/10">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Target size={14} />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Cele miesięczne</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Earnings Goal Panel */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-muted/20 border border-border/10 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6.5 w-6.5 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Coins size={13} className="text-emerald-500" />
                      </div>
                      <p className="text-xs font-bold text-foreground">Cel zarobków</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        value={monthlyEarningsGoal}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyEarningsGoal(Number(e.target.value))}
                        className="rounded-xl border-border bg-background h-8.5 text-xs px-2.5 flex-1 focus-visible:ring-1"
                      />
                      <span className="text-[10px] font-bold text-muted-foreground shrink-0">{currency}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <Progress value={earningsProgress} className="h-1.5 rounded-full overflow-hidden" />
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-muted-foreground">{stats.totalEarnings.toFixed(0)} / {monthlyEarningsGoal}</span>
                      <span className={earningsProgress >= 100 ? "text-emerald-500" : "text-primary"}>{earningsProgress.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Km Goal Panel */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-muted/20 border border-border/10 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6.5 w-6.5 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <MapPin size={13} className="text-blue-500" />
                      </div>
                      <p className="text-xs font-bold text-foreground">Cel dystansu</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        value={monthlyKmGoal}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyKmGoal(Number(e.target.value))}
                        className="rounded-xl border-border bg-background h-8.5 text-xs px-2.5 flex-1 focus-visible:ring-1"
                      />
                      <span className="text-[10px] font-bold text-muted-foreground shrink-0">km</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <Progress value={kmProgress} className="h-1.5 rounded-full overflow-hidden" />
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-muted-foreground">{stats.totalKm.toFixed(0)} / {monthlyKmGoal}</span>
                      <span className={kmProgress >= 100 ? "text-emerald-500" : "text-primary"}>{kmProgress.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logout button centered at the very bottom */}
      <div className="mt-8 pt-4 flex justify-center pb-4">
        <button
          type="button"
          onClick={logout}
          className="flex items-center justify-center gap-2.5 w-full max-w-xs px-4 py-3 rounded-xl border border-red-500/15 bg-red-500/5 hover:bg-red-500/10 active:bg-red-500/15 text-red-500 dark:text-red-400 transition-all duration-150 cursor-pointer focus:outline-none font-bold shadow-sm"
        >
          <LogOut size={15} />
          <span>Wyloguj się</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
