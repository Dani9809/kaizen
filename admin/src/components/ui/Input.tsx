import React from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  containerClassName?: string;
}

export const Input = ({
  icon: Icon,
  containerClassName = "",
  className = "",
  ...props
}: InputProps) => {
  return (
    <div className={`relative group ${containerClassName}`}>
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-secondary transition-colors" />
      )}
      <input
        className={`
          w-full ${Icon ? "pl-10" : "px-4"} pr-4 py-2 bg-white dark:bg-card border border-secondary/20 dark:border-white/5 rounded-lg text-sm 
          focus:outline-none focus:ring-2 focus:ring-secondary/20 dark:focus:ring-secondary/10 focus:border-secondary transition-all
          placeholder:text-foreground/20 dark:placeholder:text-foreground/10
          ${className}
        `}
        {...props}
      />
    </div>
  );
};
