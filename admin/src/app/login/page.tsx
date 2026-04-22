"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  User, 
  ChevronRight, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdfc] p-4 font-body selection:bg-secondary/30 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-xl shadow-secondary/30 mb-4 animate-float">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-foreground font-heading tracking-tight text-gradient">KAIZEN <span className="text-foreground/20 font-light">|</span> ADMIN</h1>
          <p className="text-foreground/40 text-sm font-bold uppercase tracking-widest mt-2">Productivity Oversight System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-secondary/10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
              <p className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-2">Access Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-secondary transition-colors" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-background/50 border border-secondary/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all font-semibold"
                  placeholder="Enter administrator ID"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-2">Secure Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-secondary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-background/50 border border-secondary/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all font-semibold"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 gamified-gradient text-white py-4 rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  INITIALIZE ACCESS
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Decoration */}
          <div className="mt-10 pt-6 border-t border-secondary/5 flex justify-center gap-8">
            <div className="flex flex-col items-center">
              <Zap className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-tighter">Fast Sync</span>
            </div>
            <div className="flex flex-col items-center">
              <Lock className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-tighter">End-to-End</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-blue-400 mb-1" />
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-tighter">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldAlert(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
  )
}
