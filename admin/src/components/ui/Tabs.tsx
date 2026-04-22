"use client";

import React from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ElementType;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, activeTab, onChange, className = "" }: TabsProps) => {
  return (
    <div className={`flex items-center gap-1 p-1 bg-secondary/5 rounded-2xl ${className}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
              ${isActive 
                ? "bg-white dark:bg-secondary text-secondary dark:text-white shadow-sm scale-[1.02]" 
                : "text-foreground/40 hover:text-foreground/60 hover:bg-secondary/5"
              }
            `}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? "text-secondary dark:text-white" : ""}`} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
