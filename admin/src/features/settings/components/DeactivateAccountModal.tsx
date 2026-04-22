"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface DeactivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeactivateAccountModal = ({ isOpen, onClose, onConfirm }: DeactivateAccountModalProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const footer = (
    <div className="flex gap-3 w-full">
      <Button 
        variant="secondary" 
        onClick={onClose} 
        className="flex-1 font-bold"
      >
        Cancel
      </Button>
      <Button 
        variant="danger" 
        onClick={onConfirm} 
        disabled={!isConfirming}
        className="flex-[1.5] font-black uppercase tracking-widest"
      >
        Deactivate Now
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Danger Zone"
      description="Account Deactivation Request"
      size="md"
      footer={footer}
      headerIcon={
        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="p-4 bg-red-50 dark:bg-red-500/5 rounded-xl border border-red-100 dark:border-red-500/10 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-red-600 dark:text-red-400">Critical Warning</p>
            <p className="text-[11px] text-red-500/80 leading-relaxed font-medium">
              Deactivating your administrative account will immediately revoke all your permissions. 
              You will be unable to manage players, monitor system metrics, or access this dashboard 
              until a Super Admin reactivates your account.
            </p>
          </div>
        </div>

        <div className="space-y-2 px-1">
          <label className="flex items-start gap-4 cursor-pointer group">
            <input 
              type="checkbox" 
              className="mt-0.5"
              checked={isConfirming}
              onChange={(e) => setIsConfirming(e.target.checked)}
            />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
              I understand that this action is restricted and I will lose access to the portal instantly.
            </span>
          </label>
        </div>
      </div>
    </Modal>
  );
};
