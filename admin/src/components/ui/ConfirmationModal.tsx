"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  loading?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmation Required"
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === "danger" ? "danger" : "gradient"} 
            onClick={onConfirm} 
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          variant === "danger" ? "bg-red-50 dark:bg-red-500/10 text-red-500" : "bg-amber-50 dark:bg-amber-500/10 text-amber-500"
        }`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-heading font-black text-lg uppercase tracking-tight text-foreground">
            {title}
          </h4>
          <p className="text-xs text-foreground/50 leading-relaxed max-w-[240px]">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
};
