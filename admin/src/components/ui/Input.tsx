import React from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label?: string;
  containerClassName?: string;
  rightElement?: React.ReactNode;
}

export const Input = ({
  icon: Icon,
  label,
  containerClassName = "",
  className = "",
  rightElement,
  ...props
}: InputProps) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-secondary transition-colors pointer-events-none" />
        )}
        <input
          className={`
            w-full ${Icon ? "pl-10" : "px-4"} ${rightElement ? "pr-12" : "pr-4"} py-2.5 bg-white dark:bg-card border border-secondary/20 dark:border-white/5 rounded-xl text-sm 
            focus:outline-none focus:ring-2 focus:ring-secondary/20 dark:focus:ring-secondary/10 focus:border-secondary transition-all
            placeholder:text-muted-foreground/30 dark:placeholder:text-muted-foreground/20
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};
