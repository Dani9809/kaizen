"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Menu, 
  Bell, 
  User as UserIcon, 
  ShieldCheck,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  LogOut,
  Check
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/components/providers/ThemeProvider";

interface HeaderProps {
  admin: {
    username: string;
    type?: string;
  } | null;
  onMenuClick: () => void;
}

const viewNames: Record<string, string> = {
  overview: "Dashboard",
  users: "User Base",
  settings: "Settings",
};

export const Header = ({ admin, onMenuClick }: HeaderProps) => {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "overview";
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <header className="h-20 shrink-0 glass z-30 px-4 lg:px-8 flex items-center justify-between shadow-sm relative">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-secondary/10 rounded-lg text-foreground/60"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="h-6 w-px bg-secondary/20 hidden sm:block lg:hidden" />
        <h2 className="text-lg font-bold text-foreground font-heading truncate max-w-[150px] sm:max-w-none">
          {viewNames[activeView] || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <button className="relative p-2 text-muted-foreground hover:text-secondary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white animate-pulse-soft" />
        </button>
        
        {admin && (
          <div className="relative" ref={modalRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-2 sm:pl-6 border-l border-secondary/20 group hover:opacity-80 transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-foreground leading-tight group-hover:text-secondary transition-colors">{admin.username}</p>
                <p className="text-[10px] text-secondary font-black uppercase tracking-widest flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3 h-3" /> {admin.type || "ADMIN"}
                </p>
              </div>
              <div className="w-9 h-9 gamified-gradient rounded-full flex items-center justify-center border-2 border-white shadow-md relative">
                <UserIcon className="w-5 h-5 text-white" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-card rounded-full border border-secondary/20 flex items-center justify-center shadow-sm">
                   <ChevronDown className={`w-2.5 h-2.5 text-secondary transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                </div>
              </div>
            </button>

            {/* Profile Modal */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 animate-in slide-in-from-top-2 fade-in duration-200 z-50">
                <Card className="shadow-2xl border-secondary/20 overflow-hidden bg-white dark:bg-card">
                  <div className="p-4 border-b border-secondary/10 bg-secondary/5">
                    <p className="text-xs font-black text-secondary uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-foreground truncate">{admin.username}</p>
                  </div>
                  
                  <div className="p-2">
                    <div className="px-3 py-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Appearance</p>
                      <div className="grid grid-cols-3 gap-2">
                        {themeOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setTheme(option.id)}
                            className={`
                              flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all border
                              ${theme === option.id 
                                ? "bg-secondary/10 border-secondary/30 text-secondary" 
                                : "bg-transparent border-transparent text-muted-foreground hover:bg-secondary/5 hover:text-secondary"}
                            `}
                          >
                            <option.icon className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-secondary/10 my-2 mx-2" />

                    <button 
                      onClick={() => {
                        localStorage.removeItem("admin_token");
                        localStorage.removeItem("admin_user");
                        window.location.href = "/login";
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wide">Sign Out</span>
                    </button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
