import React, { useState, useMemo, useEffect } from "react";
import { Trash2, Save, Clock, DollarSign, MapPin, FileText } from "lucide-react";
import type { Ride } from "../../types";
import {
  calculateWorkMinutes,
  formatWorkTime,
  calculateHourlyRate,
  toDateString,
} from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppStore } from "../../store/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RideFormProps {
  isOpen: boolean;
  ride?: Ride | null;
  initialDate?: string;
  onSave: (data: Omit<Ride, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate?: (id: string, data: Partial<Omit<Ride, "id" | "createdAt" | "updatedAt">>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const RideForm: React.FC<RideFormProps> = ({
  isOpen,
  ride,
  initialDate,
  onSave,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const { currency } = useAppStore();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [earnings, setEarnings] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      Promise.resolve().then(() => {
        setDate(ride?.date || initialDate || toDateString(new Date()));
        setStartTime(ride?.startTime || "09:00");
        setEndTime(ride?.endTime || "17:00");
        setEarnings(ride?.earnings?.toString() || "");
        setDistanceKm(ride?.distanceKm?.toString() || "");
        setNotes(ride?.notes || "");
        setErrors({});
      });
    }
  }, [isOpen, ride, initialDate]);

  const isEditing = !!ride;

  const workMinutes = useMemo(
    () => calculateWorkMinutes(startTime, endTime),
    [startTime, endTime]
  );

  const hourlyRate = useMemo(
    () => calculateHourlyRate(parseFloat(earnings) || 0, workMinutes),
    [earnings, workMinutes]
  );

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (workMinutes <= 0) {
      newErrors.time = "Godzina końca musi być po godzinie startu";
    }
    if (!earnings || parseFloat(earnings) < 0) {
      newErrors.earnings = "Zarobki muszą być >= 0";
    }
    if (!distanceKm || parseFloat(distanceKm) < 0) {
      newErrors.distance = "Kilometry muszą być >= 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      date,
      startTime,
      endTime,
      earnings: parseFloat(earnings),
      distanceKm: parseFloat(distanceKm),
      notes: notes.trim() || undefined,
    };

    if (isEditing && onUpdate && ride) {
      onUpdate(ride.id, data);
    } else {
      onSave(data as Omit<Ride, "id" | "createdAt" | "updatedAt">);
    }
    onClose();
  };

  const handleDelete = () => {
    if (ride && onDelete) {
      onDelete(ride.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-[425px] overflow-y-auto max-h-[92dvh] border-border bg-card backdrop-blur-xl shadow-2xl rounded-3xl p-4 sm:p-5 flex flex-col gap-3.5"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-2 border-b border-border/40 shrink-0">
          <DialogTitle className="text-2xl font-black text-foreground">
            {isEditing ? "Edytuj jazdę" : "Nowa jazda"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 pt-1 shrink-0">
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-0.5">Data</Label>
            <Input 
              type="date" 
              value={date} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} 
              className="rounded-xl border-border bg-background h-11 text-sm transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground px-0.5">
                <Clock size={12} className="text-primary" /> Start
              </Label>
              <Input 
                type="time" 
                value={startTime} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)} 
                className="rounded-xl border-border bg-background h-11 text-sm transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground px-0.5">
                <Clock size={12} className="text-primary" /> Koniec
              </Label>
              <Input 
                type="time" 
                value={endTime} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)} 
                className="rounded-xl border-border bg-background h-11 text-sm transition-colors"
              />
            </div>
          </div>
          {errors.time && <p className="text-xs font-semibold text-destructive">{errors.time}</p>}

          {workMinutes > 0 && (
            <div className="rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-xs text-center font-bold text-primary">
              Czas pracy: {formatWorkTime(workMinutes)}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground px-0.5">
              <DollarSign size={12} className="text-primary" /> Zarobki
            </Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={earnings}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEarnings(e.target.value)}
              placeholder="0.00"
              className="rounded-xl border-border bg-background h-11 text-sm transition-colors"
            />
            {errors.earnings && <p className="text-xs font-semibold text-destructive">{errors.earnings}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground px-0.5">
              <MapPin size={12} className="text-primary" /> Dystans (km)
            </Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={distanceKm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDistanceKm(e.target.value)}
              placeholder="0.0"
              className="rounded-xl border-border bg-background h-11 text-sm transition-colors"
            />
            {errors.distance && <p className="text-xs font-semibold text-destructive">{errors.distance}</p>}
          </div>

          {workMinutes > 0 && parseFloat(earnings) > 0 && (
            <div className="rounded-xl bg-secondary border border-border/40 px-3 py-2 text-xs text-center font-bold text-foreground">
              Stawka: {hourlyRate.toFixed(2)} {currency}/h
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground px-0.5">
              <FileText size={12} className="text-primary" /> Notatki
            </Label>
            <Input
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
              placeholder="Dodaj notatki..."
              className="rounded-xl border-border bg-background h-11 text-sm transition-colors"
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 border-t border-border/40 mt-1">
            {isEditing && (
              <Button type="button" variant="destructive" onClick={handleDelete} className="w-full sm:w-auto rounded-xl h-11 font-semibold">
                <Trash2 size={16} className="mr-2" /> Usuń
              </Button>
            )}
            <div className="flex gap-2 w-full sm:w-auto ml-auto">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl h-11 font-semibold">
                Anuluj
              </Button>
              <Button type="submit" className="flex-1 rounded-xl h-11 font-semibold shadow-lg shadow-primary/25">
                <Save size={16} className="mr-2" /> Zapisz
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RideForm;
