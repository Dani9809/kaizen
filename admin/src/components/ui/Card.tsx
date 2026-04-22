import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = "", hover = true, ...props }: CardProps) => {
  return (
    <div 
      {...props}
      className={`
        bg-white dark:bg-card rounded-2xl border border-secondary/10 dark:border-white/5 shadow-sm overflow-hidden
        ${hover ? "hover:border-secondary/30 dark:hover:border-secondary/20 transition-all hover:-translate-y-0.5" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 border-b border-secondary/10 dark:border-white/5 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);
