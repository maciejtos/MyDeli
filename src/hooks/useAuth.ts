import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd logowania Google";
      setError(message);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd logowania";
      setError(message);
    }
  };

  const registerWithEmail = async (email: string, password: string, displayName: string) => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd rejestracji";
      setError(message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd wylogowania";
      setError(message);
    }
  };

  const changePassword = async (newPassword: string) => {
    setError(null);
    try {
      if (auth.currentUser) {
        await firebaseUpdatePassword(auth.currentUser, newPassword);
      } else {
        throw new Error("Brak zalogowanego użytkownika");
      }
    } catch (err: unknown) {
      let message = "Błąd zmiany hasła";
      if (err instanceof Error) {
        message = err.message;
        if ((err as { code?: string }).code === "auth/requires-recent-login") {
          message = "Ta operacja wymaga ponownego zalogowania ze względów bezpieczeństwa.";
        }
      }
      setError(message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    changePassword,
    clearError: () => setError(null),
  };
}
