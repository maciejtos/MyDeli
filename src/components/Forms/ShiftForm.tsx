import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Shift } from "../../types";

interface ShiftFormProps {
  isOpen: boolean;
  shift: Shift | null;
  initialDate?: string;
  onSave: (data: Omit<Shift, "id">) => void;
  onUpdate: (id: string, data: Partial<Omit<Shift, "id">>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const ShiftForm: React.FC<ShiftFormProps> = ({
  isOpen,
  shift,
  initialDate,
  onSave,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [targetKm, setTargetKm] = useState("");
  const [targetEarnings, setTargetEarnings] = useState("");
  const [targetHourlyRate, setTargetHourlyRate] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (shift) {
        setDate(shift.date);
        setStartTime(shift.startTime);
        setEndTime(shift.endTime);
        setTargetKm(shift.targetKm !== undefined ? shift.targetKm.toString() : "");
        setTargetEarnings(shift.targetEarnings !== undefined ? shift.targetEarnings.toString() : "");
        setTargetHourlyRate(shift.targetHourlyRate !== undefined ? shift.targetHourlyRate.toString() : "");
      } else {
        setDate(initialDate || new Date().toISOString().split("T")[0]);
        setStartTime("08:00");
        setEndTime("16:00");
        setTargetKm("");
        setTargetEarnings("");
        setTargetHourlyRate("");
      }
    }
  }, [isOpen, shift, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) return;

    const data = {
      date,
      startTime,
      endTime,
      targetKm: targetKm !== "" ? parseFloat(targetKm) : undefined,
      targetEarnings: targetEarnings !== "" ? parseFloat(targetEarnings) : undefined,
      targetHourlyRate: targetHourlyRate !== "" ? parseFloat(targetHourlyRate) : undefined,
    };

    if (shift) {
      onUpdate(shift.id, data);
    } else {
      onSave(data);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] border-border bg-card backdrop-blur-xl shadow-2xl rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-foreground">
            {shift ? "Edytuj zmianę" : "Zaplanuj zmianę"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl h-12 bg-muted/50 border-border/50 text-foreground font-semibold"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Od</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded-xl h-12 bg-muted/50 border-border/50 text-foreground font-semibold"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Do</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded-xl h-12 bg-muted/50 border-border/50 text-foreground font-semibold"
                required
              />
            </div>
          </div>
          <div className="border-t border-border/40 my-2 pt-2 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-primary/80">Cele na zmianę (Opcjonalnie)</div>
            <div className="space-y-2">
              <Label htmlFor="targetEarnings" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cel Zarobków (PLN)</Label>
              <Input
                id="targetEarnings"
                type="number"
                step="0.01"
                placeholder="np. 200"
                value={targetEarnings}
                onChange={(e) => setTargetEarnings(e.target.value)}
                className="rounded-xl h-12 bg-muted/50 border-border/50 text-foreground font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetKm" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cel dystansu (KM)</Label>
                <Input
                  id="targetKm"
                  type="number"
                  step="0.1"
                  placeholder="np. 50"
                  value={targetKm}
                  onChange={(e) => setTargetKm(e.target.value)}
                  className="rounded-xl h-12 bg-muted/50 border-border/50 text-foreground font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetHourlyRate" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cel stawki (/h)</Label>
                <Input
                  id="targetHourlyRate"
                  type="number"
                  step="0.1"
                  placeholder="np. 30"
                  value={targetHourlyRate}
                  onChange={(e) => setTargetHourlyRate(e.target.value)}
                  className="rounded-xl h-12 bg-muted/50 border-border/50 text-foreground font-semibold"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 flex gap-2">
            {shift && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => onDelete(shift.id)}
                className="rounded-xl font-bold"
              >
                Usuń
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold ml-auto">
              Anuluj
            </Button>
            <Button type="submit" className="rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              {shift ? "Zapisz" : "Dodaj"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftForm;
