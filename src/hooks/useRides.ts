import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firestore";
import { useAuth } from "./useAuth";
import type { Ride } from "../types";

export function useRides() {
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      Promise.resolve().then(() => {
        setRides([]);
        setLoading(false);
      });
      return;
    }

    const ridesRef = collection(db, "users", user.uid, "rides");
    const q = query(ridesRef, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ridesData: Ride[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ride[];
      setRides(ridesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching rides:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addRide = useCallback(
    async (ride: Omit<Ride, "id" | "createdAt" | "updatedAt">) => {
      if (!user) return;
      try {
        const ridesRef = collection(db, "users", user.uid, "rides");
        await addDoc(ridesRef, {
          ...ride,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      } catch (error: any) {
        console.error("Error adding ride:", error);
        throw error;
      }
    },
    [user]
  );

  const updateRide = useCallback(
    async (rideId: string, data: Partial<Omit<Ride, "id" | "createdAt" | "updatedAt">>) => {
      if (!user) return;
      try {
        const rideRef = doc(db, "users", user.uid, "rides", rideId);
        await updateDoc(rideRef, {
          ...data,
          updatedAt: Timestamp.now(),
        });
      } catch (error: any) {
        console.error("Error updating ride:", error);
        throw error;
      }
    },
    [user]
  );

  const deleteRide = useCallback(
    async (rideId: string) => {
      if (!user) return;
      try {
        const rideRef = doc(db, "users", user.uid, "rides", rideId);
        await deleteDoc(rideRef);
      } catch (error: any) {
        console.error("Error deleting ride:", error);
        throw error;
      }
    },
    [user]
  );

  const getRidesByMonth = useCallback(
    (year: number, month: number): Ride[] => {
      const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
      return rides.filter((r) => r.date.startsWith(monthStr));
    },
    [rides]
  );

  const getRidesByDate = useCallback(
    (date: string): Ride[] => {
      return rides.filter((r) => r.date === date);
    },
    [rides]
  );

  return {
    rides,
    loading,
    addRide,
    updateRide,
    deleteRide,
    getRidesByMonth,
    getRidesByDate,
  };
}
