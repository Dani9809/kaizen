"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Copy, Lock } from "lucide-react";
import { Input } from "./Input";
import { toast } from "react-hot-toast";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  generateAction?: React.ReactNode;
  containerClassName?: string;
}

export const PasswordField = ({
  label,
  generateAction,
  containerClassName = "",
  value,
  ...props
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(String(value));
    toast.success("Password copied to clipboard");
  };

  const rightElements = (
    <div className="flex items-center gap-1 pr-1">
      <button
        type="button"
        onClick={handleCopy}
        className="p-1.5 hover:bg-secondary/10 rounded-lg text-foreground/40 hover:text-secondary transition-all"
        title="Copy Password"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="p-1.5 hover:bg-secondary/10 rounded-lg text-foreground/40 hover:text-secondary transition-all"
        title={showPassword ? "Hide Password" : "Show Password"}
      >
        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  );

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      <div className="flex items-center justify-between px-1">
        {label && (
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
            {label}
          </label>
        )}
        {generateAction}
      </div>
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        value={value}
        icon={Lock}
        rightElement={rightElements}
      />
    </div>
  );
};
