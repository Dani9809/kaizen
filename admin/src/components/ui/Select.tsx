"use client";

import React from "react";
import { LucideIcon, ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: LucideIcon;
  label?: string;
  options: { value: string | number; label: string }[];
  containerClassName?: string;
}

export const Select = ({
  icon: Icon,
  label,
  options,
  containerClassName = "",
  className = "",
  ...props
}: SelectProps) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-secondary transition-colors pointer-events-none" />
        )}
        <select
          className={`
            w-full ${Icon ? "pl-10" : "px-4"} pr-10 py-2.5 bg-white dark:bg-card border border-secondary/20 dark:border-white/5 rounded-xl text-sm appearance-none
            focus:outline-none focus:ring-2 focus:ring-secondary/20 dark:focus:ring-secondary/10 focus:border-secondary transition-all
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 pointer-events-none group-focus-within:text-secondary transition-colors" />
      </div>
    </div>
  );
};
