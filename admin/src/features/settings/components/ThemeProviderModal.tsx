"use client";

import React from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface ThemeProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeProviderModal = ({ isOpen, onClose }: ThemeProviderModalProps) => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: "light", name: "Light Mode", icon: Sun, description: "Classic bright appearance" },
    { id: "dark", name: "Dark Mode", icon: Moon, description: "Sleek and easy on the eyes" },
    { id: "system", name: "System Default", icon: Monitor, description: "Syncs with your device" },
  ] as const;

  const footer = (
    <div className="flex justify-end w-full">
      <Button variant="primary" onClick={onClose} className="px-8 font-black uppercase tracking-widest text-xs">
        Done
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interface Theme"
      description="Choose your preferred visual experience"
      size="md"
      footer={footer}
    >
      <div className="space-y-3">
        {themes.map((item) => {
          const isActive = theme === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTheme(item.id)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group
                ${isActive 
                  ? "bg-secondary/10 border-secondary/30 shadow-sm" 
                  : "bg-background border-transparent hover:border-secondary/20 hover:bg-secondary/5"}
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                ${isActive ? "bg-secondary text-white" : "bg-secondary/5 text-muted-foreground group-hover:text-secondary"}
              `}>
                <item.icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-bold ${isActive ? "text-secondary" : "text-foreground"}`}>
                  {item.name}
                </p>
                <p className="text-[10px] text-muted-foreground">{item.description}</p>
              </div>

              {isActive && (
                <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
