import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const LoginPage: React.FC = () => {
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isRegister) {
      await registerWithEmail(email, password, displayName);
    } else {
      await loginWithEmail(email, password);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-background via-background/95 to-primary/10 px-4 relative overflow-hidden">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-2/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center mb-6 text-center">
          <h1 className="text-4xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            MyDeli
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1.5">
            Twój cyfrowy dziennik jazd
          </p>
        </div>

        <Card className="border-border/40 shadow-2xl backdrop-blur-xl bg-card/75 rounded-3xl overflow-hidden border">
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isRegister ? "Załóż konto" : "Witaj ponownie"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isRegister
                ? "Wprowadź dane, aby utworzyć nowe konto."
                : "Zaloguj się na swoje konto, aby kontynuować."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive font-semibold animate-shake">
                {error}
              </div>
            )}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Imię</Label>
                  <Input
                    id="name"
                    placeholder="Jan Kowalski"
                    value={displayName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                    required
                    className="rounded-xl border-border bg-background/80 focus:bg-background transition-colors h-11"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m.kowalski@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  className="rounded-xl border-border bg-background/80 focus:bg-background transition-colors h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hasło</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="rounded-xl border-border bg-background/80 focus:bg-background transition-colors h-11"
                />
              </div>
              <Button type="submit" className="w-full rounded-xl h-11 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 cursor-pointer" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isRegister ? "Zarejestruj się" : "Zaloguj się"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-semibold">
                <span className="bg-card px-3 text-muted-foreground rounded-full border border-border/40 py-0.5 backdrop-blur-md">
                  Lub kontynuuj z
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full rounded-xl h-11 bg-background/50 hover:bg-muted border-border/60 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              disabled={loading}
              onClick={handleGoogleLogin}
            >
              <svg className="mr-2 h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.24-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/40 bg-muted/20 py-4">
            <p className="text-sm text-muted-foreground font-medium">
              {isRegister ? "Masz już konto?" : "Nie masz konta?"}{" "}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  clearError();
                }}
                className="font-semibold text-primary hover:underline hover:text-primary/95 transition-colors focus:outline-none cursor-pointer"
              >
                {isRegister ? "Zaloguj się" : "Zarejestruj się"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
