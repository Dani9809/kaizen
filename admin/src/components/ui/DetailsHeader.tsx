"use client";

import React from "react";
import { BackButton } from "./BackButton";
import { Badge } from "./Badge";
import { LucideIcon, Calendar, Clock } from "lucide-react";

interface Action {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "gradient" | "danger" | "neutral";
  icon?: LucideIcon;
  loading?: boolean;
}

interface MetaItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface DetailsHeaderProps {
  title: string;
  backHref: string;
  badgeText?: string;
  badgeVariant?: "success" | "warning" | "danger" | "info" | "neutral";
  metaItems?: MetaItem[];
  actions?: Action[];
  className?: string;
}

export const DetailsHeader = ({
  title,
  backHref,
  badgeText,
  badgeVariant = "neutral",
  metaItems = [],
  actions = [],
  className = "",
}: DetailsHeaderProps) => {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <BackButton href={backHref} className="mt-1 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading uppercase tracking-tight truncate max-w-full" title={title}>
                {title}
              </h1>
              {badgeText && (
                <Badge variant={badgeVariant} className="shrink-0 uppercase text-[10px] font-black">
                  {badgeText}
                </Badge>
              )}
            </div>
            
            {metaItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {metaItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-tight whitespace-nowrap">
                      {item.label} {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                disabled={action.loading}
                className={`
                  flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${action.variant === "gradient" 
                    ? "bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-0.5 active:translate-y-0" 
                    : action.variant === "danger"
                    ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                    : action.variant === "secondary"
                    ? "bg-secondary/10 text-secondary border border-secondary/10 hover:bg-secondary/20"
                    : "bg-white dark:bg-card text-foreground border border-secondary/20 hover:bg-secondary/5"}
                  ${action.loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {action.icon && <action.icon className="w-3.5 h-3.5" />}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
