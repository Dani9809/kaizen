"use client";

import React, { useState, useEffect } from "react";
import { Shield, Lock, Save, ArrowLeft, Loader2, RefreshCw, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PasswordField } from "@/components/ui/PasswordField";
import { useSettings } from "../hooks/useSettings";
import { toast } from "sonner";
import { generatePassword, validatePassword } from "@/lib/password";

interface AccountSecurityProps {
  onBack: () => void;
  admin: any;
}

export const AccountSecurity = ({ onBack, admin }: AccountSecurityProps) => {
  const { changePassword, loading } = useSettings();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";
  const showMatchError = formData.confirmPassword !== "" && !passwordsMatch;
  
  const [validation, setValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setValidation(validatePassword(formData.password));
  }, [formData.password]);

  const handleGenerate = () => {
    const newPass = generatePassword(16);
    setFormData(prev => ({ ...prev, password: newPass, confirmPassword: newPass }));
    toast.success("Strong password generated");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin?.id) return;
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!Object.values(validation).every(Boolean)) {
      return toast.error("Password does not meet all security requirements");
    }
    
    try {
      await changePassword(admin.id, { password: formData.password });
      setFormData({ password: "", confirmPassword: "" });
    } catch (err) {
      // Error handled by hook
    }
  };

  const requirements = [
    { key: 'length', label: '8+ Characters' },
    { key: 'uppercase', label: 'Uppercase Letter' },
    { key: 'lowercase', label: 'Lowercase Letter' },
    { key: 'number', label: 'Number' },
    { key: 'special', label: 'Special Character' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-secondary/10 rounded-xl text-muted-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Account Security</h2>
          <p className="text-xs text-muted-foreground font-medium">Manage your password and security settings</p>
        </div>
      </div>

      <Card className="w-full overflow-hidden" hover={false}>
        <div className="p-8 space-y-8">
          <div className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 shrink-0">
              <Shield className="w-6 h-6 text-amber-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-600">Security Recommendation</p>
              <p className="text-xs text-amber-500/80 leading-relaxed font-medium">
                Use a strong, unique password to protect your administrative account. 
                Changing your password regularly enhances your security profile and prevents unauthorized access.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <PasswordField
                  label="New Password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  generateAction={
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-secondary/80 transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Generate Strong
                    </button>
                  }
                  required
                />

                <div className="space-y-2">
                  <PasswordField
                    label="Confirm New Password"
                    placeholder="Repeat your new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={showMatchError ? "border-red-500/50 focus:border-red-500" : ""}
                    required
                  />
                  {showMatchError && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight ml-1 animate-in fade-in slide-in-from-top-1">
                      Passwords do not match
                    </p>
                  )}
                  {passwordsMatch && (
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-tight ml-1 animate-in fade-in slide-in-from-top-1">
                      Passwords match
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    Password Requirements
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {requirements.map((req) => (
                      <div key={req.key} className="flex items-center gap-2.5 group">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${validation[req.key as keyof typeof validation] ? 'bg-secondary text-white shadow-sm' : 'bg-background border border-secondary/10 text-muted-foreground/30'}`}>
                          {validation[req.key as keyof typeof validation] ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Circle className="w-2.5 h-2.5 fill-current" />
                          )}
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-tight transition-colors ${validation[req.key as keyof typeof validation] ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 px-6 bg-foreground/[0.02] rounded-2xl border border-foreground/5 italic">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    * For your safety, passwords are encrypted using high-entropy hashing. Administrators cannot recover your old password.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-secondary/5">
              <Button 
                variant="gradient" 
                size="lg" 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto gap-3 px-12 font-black uppercase tracking-widest shadow-lg shadow-secondary/20"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Secure My Account
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
