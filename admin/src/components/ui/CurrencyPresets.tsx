"use client";

import React from "react";

interface CurrencyPresetsProps {
  presets: number[];
  onSelect: (value: number) => void;
  currentValue: number;
}

export const CurrencyPresets = ({ presets, onSelect, currentValue }: CurrencyPresetsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((amount) => (
        <button
          key={amount}
          onClick={() => onSelect(amount)}
          className={`
            px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border
            ${currentValue === amount 
              ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20 scale-105" 
              : "bg-secondary/5 text-foreground/40 border-secondary/10 hover:border-secondary/30 hover:bg-secondary/10 hover:text-secondary"
            }
          `}
        >
          {amount.toLocaleString()}
        </button>
      ))}
    </div>
  );
};
