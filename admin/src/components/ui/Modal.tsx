"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md"
}: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`
        relative w-full ${sizeClasses[size]} bg-white dark:bg-card border border-secondary/20 dark:border-white/5 
        rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300
      `}>
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-secondary/10 flex items-center justify-between bg-secondary/5">
          <h3 className="font-heading font-black text-lg uppercase tracking-tight text-foreground">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary/10 rounded-xl text-foreground/40 hover:text-secondary transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-4 sm:px-6 py-4 border-t border-secondary/10 bg-secondary/5 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
