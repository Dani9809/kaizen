import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-white dark:bg-card border border-secondary/20 dark:border-white/5 text-foreground/60 dark:text-foreground/40 hover:bg-secondary/5 dark:hover:bg-white/5",
    secondary: "bg-secondary/10 dark:bg-secondary/20 text-secondary hover:bg-secondary/20 dark:hover:bg-secondary/30",
    ghost: "bg-transparent text-foreground/40 dark:text-foreground/30 hover:bg-secondary/5 dark:hover:bg-white/5 hover:text-secondary",
    danger: "bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20",
    gradient: "gamified-gradient text-white shadow-lg shadow-secondary/20 dark:shadow-none hover:scale-105",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px] uppercase tracking-widest",
    md: "px-4 py-2 text-xs",
    lg: "px-6 py-3 text-sm",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};
