"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";

interface BackButtonProps {
  href?: string;
  className?: string;
  label?: string;
}

export function BackButton({ href, className = "", label }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      window.history.back();
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={`
        group flex items-center gap-2 px-3 py-2 -ml-3 
        hover:bg-secondary/10 text-muted-foreground hover:text-secondary 
        transition-all duration-300 rounded-xl
        ${className}
      `}
    >
      <div className="w-9 h-9 flex items-center justify-center bg-secondary/5 group-hover:bg-secondary group-hover:text-white rounded-lg transition-all shadow-sm">
        <ArrowLeft className="w-5 h-5" />
      </div>
      {label && (
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      )}
    </Button>
  );
}
