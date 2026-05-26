import React, { useState, useCallback, useMemo } from "react";
import MonthNavigator from "../components/Calendar/MonthNavigator";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import RideForm from "../components/Forms/RideForm";
import { useRides } from "../hooks/useRides";
import { useAppStore } from "../store/appStore";
import { Plus, Clock, Edit3, Trash2, FileText, CheckCircle2, Bike } from "lucide-react";
import {
  formatDate,
  calculateWorkMinutes,
  formatWorkTime,
  calculateHourlyRate,
  calculateEarningsPerKm,
} from "../lib/utils";
import type { Ride } from "../types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CalendarPage: React.FC = () => {
  const { currentYear, currentMonth, currency } = useAppStore();
  const { addRide, updateRide, deleteRide, getRidesByMonth, getRidesByDate } = useRides();

  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingRide, setEditingRide] = useState<Ride | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const monthRides = useMemo(
    () => getRidesByMonth(currentYear, currentMonth),
    [getRidesByMonth, currentYear, currentMonth]
  );

  const selectedDayRides = useMemo(
    () => (selectedDate ? getRidesByDate(selectedDate) : []),
    [getRidesByDate, selectedDate]
  );

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDayClick = useCallback((date: string) => {
    setSelectedDate(date);
    setShowDayModal(true);
  }, []);



  const handleSave = useCallback(
    async (data: Omit<Ride, "id" | "createdAt" | "updatedAt">) => {
      await addRide(data);
      showToast("Jazda zapisana pomyślnie");
    },
    [addRide]
  );

  const handleUpdate = useCallback(
    async (id: string, data: Partial<Omit<Ride, "id" | "createdAt" | "updatedAt">>) => {
      await updateRide(id, data);
      showToast("Jazda zaktualizowana");
    },
    [updateRide]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteRide(id);
      showToast("Jazda usunięta");
      setShowDayModal(false);
    },
    [deleteRide]
  );

  return (
    <div className="animate-in fade-in duration-500 pb-8 relative">
      <MonthNavigator />

      <CalendarGrid rides={monthRides} onDayClick={handleDayClick} />



      <RideForm
        isOpen={showForm}
        ride={editingRide}
        initialDate={selectedDate || undefined}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onClose={() => {
          setShowForm(false);
          setEditingRide(null);
        }}
      />

      {/* Day Detail Dialog */}
      <Dialog open={showDayModal} onOpenChange={(open) => !open && setShowDayModal(false)}>
        <DialogContent className="sm:max-w-[425px] max-h-[90dvh] overflow-y-auto border-border bg-card backdrop-blur-xl shadow-2xl rounded-3xl p-5">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="capitalize text-2xl font-black text-foreground">
              {selectedDate ? formatDate(selectedDate) : ""}
            </DialogTitle>
          </DialogHeader>

          {selectedDayRides.length > 0 ? (
            <div className="space-y-6 pt-4">
              {/* Day Summary */}
              <div className="grid grid-cols-2 gap-3.5">
                <Card className="bg-primary/10 border-primary/25 shadow-sm rounded-2xl">
                  <CardContent className="p-3.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Zarobki</p>
                    <p className="text-2xl font-black text-primary">
                      {selectedDayRides.reduce((s, r) => s + r.earnings, 0).toFixed(2)} <span className="text-sm font-bold">{currency}</span>
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary border-border/40 shadow-sm rounded-2xl">
                  <CardContent className="p-3.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Czas pracy</p>
                    <p className="text-2xl font-black text-foreground">
                      {formatWorkTime(
                        selectedDayRides.reduce((s, r) => s + calculateWorkMinutes(r.startTime, r.endTime), 0)
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Rides List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Szczegóły jazd</h3>
                {selectedDayRides.map((ride) => (
                  <Card key={ride.id} className="overflow-hidden border-border shadow-md bg-card rounded-2xl transition-all hover:scale-[1.01]">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-3.5 bg-muted/40">
                        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                          <Clock size={16} className="text-primary" />
                          {ride.startTime} - {ride.endTime}
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-muted text-foreground/75"
                            onClick={() => {
                              setEditingRide(ride);
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
                            onClick={() => handleDelete(ride.id)}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="p-4 grid grid-cols-2 gap-4 text-xs font-medium">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Kwota</span>
                          <span className="font-extrabold text-sm text-foreground">{ride.earnings.toFixed(2)} {currency}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Dystans</span>
                          <span className="font-extrabold text-sm text-foreground">{ride.distanceKm.toFixed(1)} km</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Stawka/h</span>
                          <span className="font-extrabold text-sm text-foreground">
                            {calculateHourlyRate(ride.earnings, calculateWorkMinutes(ride.startTime, ride.endTime)).toFixed(2)} {currency}/h
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Rentowność</span>
                          <span className="font-extrabold text-sm text-foreground">
                            {calculateEarningsPerKm(ride.earnings, ride.distanceKm).toFixed(2)} {currency}/km
                          </span>
                        </div>
                      </div>
                      {ride.notes && (
                        <div className="px-4 pb-4">
                          <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-xl text-xs">
                            <FileText size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                            <p className="text-muted-foreground leading-relaxed italic">{ride.notes}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-inner">
                <Bike size={28} />
              </div>
              <p className="text-lg font-bold text-foreground">Brak jazd w tym dniu</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px] leading-relaxed">
                Naciśnij przycisk poniżej, aby zarejestrować jazdę w tym dniu.
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-border/40 pt-4">
            <Button
              className="w-full rounded-xl h-11 font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              onClick={() => {
                setShowDayModal(false);
                setEditingRide(null);
                setShowForm(true);
              }}
            >
              <Plus className="mr-2" size={18} />
              Dodaj jazdę
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex items-center gap-2.5 rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-semibold shadow-2xl">
            <CheckCircle2 size={18} className="text-primary" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
