import React, { useState, useMemo } from "react";
import MonthNavigator from "../components/Calendar/MonthNavigator";
import { useAppStore } from "../store/appStore";
import { useScheduleStore } from "../store/scheduleStore";
import ShiftForm from "../components/Forms/ShiftForm";
import { getDaysInMonth, getFirstDayOfMonth, toDateString, formatDate } from "../lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Clock, Edit3, Trash2, CalendarClock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Shift } from "../types";

const DAY_HEADERS = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];

const SchedulePage: React.FC = () => {
  const { currentYear, currentMonth, currency } = useAppStore();
  const { shifts, addShift, updateShift, deleteShift, getShiftsByDate } = useScheduleStore();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setShowDayModal(true);
  };

  const selectedDayShifts = useMemo(
    () => (selectedDate ? getShiftsByDate(selectedDate) : []),
    [selectedDate, getShiftsByDate, shifts]
  );

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const dateStr = toDateString(dateObj);
      const dayShifts = shifts.filter((s) => s.date === dateStr);
      days.push({ day: d, dateStr, dayShifts });
    }
    return days;
  }, [currentYear, currentMonth, shifts]);

  return (
    <div className="animate-in fade-in duration-300 pb-8 relative">
      <MonthNavigator title="Grafik" />

      <Card className="border-border shadow-md sm:shadow-xl overflow-hidden bg-card backdrop-blur-md rounded-2xl sm:rounded-3xl h-[calc(100dvh-11.5rem)] md:h-[calc(100dvh-8.5rem)] min-h-[460px] w-full mt-4">
        <CardContent className="p-1 sm:p-4 h-full flex flex-col">
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-2 shrink-0">
            {DAY_HEADERS.map((d, i) => (
              <div
                key={d}
                className={cn(
                  "text-center text-[10px] uppercase font-bold tracking-widest py-1.5 rounded-lg",
                  i === 6 ? "text-red-500 bg-red-500/8" : i === 5 ? "text-primary/80 bg-primary/6" : "text-muted-foreground bg-muted/40"
                )}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr flex-1 pb-0.5">
            {calendarDays.map((item, idx) => {
              if (!item) return <div key={`empty-${idx}`} className="h-full w-full" />;
              const isToday = item.dateStr === toDateString(new Date());
              const hasShifts = item.dayShifts.length > 0;

              return (
                <button
                  key={item.dateStr}
                  onClick={() => handleDayClick(item.dateStr)}
                  className={cn(
                    "relative flex flex-col items-center justify-start h-full w-full rounded-lg sm:rounded-xl p-0.5 sm:p-1 md:p-1.5 transition-colors duration-150 border",
                    isToday ? "border-primary bg-primary/8 ring-2 ring-primary/25 shadow-md shadow-primary/10" : "border-border bg-card hover:bg-accent/50",
                    hasShifts && !isToday && "border-primary/35 bg-primary/4 hover:bg-primary/8"
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 text-[10px] sm:text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full mt-0.5",
                      isToday ? "bg-primary text-primary-foreground font-extrabold shadow-sm shadow-primary/30" : "text-foreground/90",
                      hasShifts && !isToday && "text-foreground font-extrabold"
                    )}
                  >
                    {item.day}
                  </span>
                  {hasShifts && (
                    <div className="mt-auto flex flex-col items-center gap-0.5 pb-1 w-full px-1">
                      {item.dayShifts.map((shift, sIdx) => (
                        <div key={sIdx} className="text-[8px] sm:text-[9px] bg-primary/15 text-primary font-bold px-1 py-0.5 rounded w-full text-center truncate">
                          {shift.startTime}-{shift.endTime}
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ShiftForm
        isOpen={showForm}
        shift={editingShift}
        initialDate={selectedDate || undefined}
        onSave={(data) => addShift(data)}
        onUpdate={(id, data) => updateShift(id, data)}
        onDelete={(id) => {
          deleteShift(id);
          setShowDayModal(false);
        }}
        onClose={() => {
          setShowForm(false);
          setEditingShift(null);
        }}
      />

      <Dialog open={showDayModal} onOpenChange={(open) => !open && setShowDayModal(false)}>
        <DialogContent className="sm:max-w-[425px] max-h-[90dvh] overflow-y-auto border-border bg-card backdrop-blur-xl shadow-2xl rounded-3xl p-5">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="capitalize text-2xl font-black text-foreground">
              {selectedDate ? formatDate(selectedDate) : ""}
            </DialogTitle>
          </DialogHeader>

          {selectedDayShifts.length > 0 ? (
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Planowane zmiany</h3>
              {selectedDayShifts.map((shift) => (
                <Card key={shift.id} className="overflow-hidden border-border shadow-md bg-card rounded-2xl">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-3.5 bg-muted/40">
                      <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                        <Clock size={16} className="text-primary" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                      <div className="flex gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-muted text-foreground/75"
                          onClick={() => {
                            setEditingShift(shift);
                            setShowDayModal(false);
                            setShowForm(true);
                          }}
                        >
                          <Edit3 size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            deleteShift(shift.id);
                            setShowDayModal(false);
                          }}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </div>
                    {(shift.targetEarnings !== undefined || shift.targetKm !== undefined || shift.targetHourlyRate !== undefined) && (
                      <>
                        <Separator className="bg-border/50" />
                        <div className="p-4 grid grid-cols-3 gap-2 text-xs font-medium text-center bg-card">
                          {shift.targetEarnings !== undefined && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Cel zarobków</span>
                              <span className="font-extrabold text-sm text-foreground">{shift.targetEarnings} {currency}</span>
                            </div>
                          )}
                          {shift.targetKm !== undefined && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Cel km</span>
                              <span className="font-extrabold text-sm text-foreground">{shift.targetKm} km</span>
                            </div>
                          )}
                          {shift.targetHourlyRate !== undefined && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Cel stawki</span>
                              <span className="font-extrabold text-sm text-foreground">{shift.targetHourlyRate} {currency}/h</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-inner">
                <CalendarClock size={28} />
              </div>
              <p className="text-lg font-bold text-foreground">Brak zaplanowanych zmian</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px] leading-relaxed">
                Dodaj zmianę, aby zaplanować swoją pracę w tym dniu.
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-border/40 pt-4">
            <Button
              className="w-full rounded-xl h-11 font-semibold shadow-lg shadow-primary/20 active:scale-[0.98]"
              onClick={() => {
                setShowDayModal(false);
                setEditingShift(null);
                setShowForm(true);
              }}
            >
              <Plus className="mr-2" size={18} />
              Zaplanuj zmianę
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulePage;
