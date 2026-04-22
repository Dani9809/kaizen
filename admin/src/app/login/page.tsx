"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight,
  ShieldAlert,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiHost = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3000` : 'http://localhost:3000';
      const response = await fetch(`${apiHost}/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pass: password }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.message || (response.status === 500 ? "Internal Server Error" : "Login failed");
        throw new Error(errorMsg);
      }

      const data = await response.json();
      localStorage.setItem("admin_token", data.access_token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.username}!`);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-body selection:bg-secondary/30 relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      
      {/* Theme Toggle in Corner */}
      <div className="absolute top-6 right-6 flex items-center gap-1 p-1 bg-white dark:bg-card border border-secondary/10 rounded-xl shadow-lg z-20">
        {[
          { id: 'light', icon: Sun },
          { id: 'dark', icon: Moon },
          { id: 'system', icon: Monitor },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setTheme(opt.id as any)}
            className={`p-1.5 rounded-lg transition-all ${theme === opt.id ? 'bg-secondary text-white' : 'text-muted-foreground hover:bg-secondary/5'}`}
          >
            <opt.icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Login Card */}
        <div className="bg-white/70 dark:bg-card/70 backdrop-blur-2xl p-6 rounded-[2rem] border border-white dark:border-white/5 shadow-2xl shadow-secondary/5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center shadow-xl shadow-secondary/30 mb-4 animate-float relative overflow-hidden group">
              <ShieldCheck className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
            <h1 className="text-2xl font-black text-foreground font-heading tracking-tight">
              KAIZEN <span className="text-secondary tracking-tighter uppercase">Admin</span>
            </h1>
            <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.3em] mt-2 opacity-80">Administrative Interface</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[11px] font-bold animate-in slide-in-from-top-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Access Username"
              icon={User}
              placeholder="Administrator ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />

            <Input
              label="Secure Key"
              icon={Lock}
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="gradient"
              loading={loading}
              className="w-full py-4 rounded-xl text-xs tracking-[0.1em] uppercase font-black mt-2"
            >
              INITIALIZE ACCESS
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
