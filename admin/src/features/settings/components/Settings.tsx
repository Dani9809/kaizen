"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  User, 
  Shield, 
  Palette, 
  BellOff, 
  LogOut, 
  UserX, 
  ChevronRight,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { AccountInfo } from "./AccountInfo";
import { AccountSecurity } from "./AccountSecurity";
import { ThemeProviderModal } from "./ThemeProviderModal";
import { DeactivateAccountModal } from "./DeactivateAccountModal";
import { useSettings } from "../hooks/useSettings";

export default function Settings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { deactivateAccount } = useSettings();
  
  const [admin, setAdmin] = useState<any>(null);
  const subPage = searchParams.get("sub");
  useEffect(() => {
    const user = localStorage.getItem("admin_user");
    if (user) {
      setAdmin(JSON.parse(user));
    }
  }, []);

  const openModal = (modal: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", modal);
    router.push(`?${params.toString()}`);
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.push(`?${params.toString()}`);
  };

  const currentModal = searchParams.get("modal");
  const isThemeModalOpen = currentModal === "theme";
  const isDeactivateModalOpen = currentModal === "deactivate";

  const navigateTo = (sub: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sub) {
      params.set("sub", sub);
    } else {
      params.delete("sub");
    }
    router.push(`?${params.toString()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/login");
    toast.success("Logged out successfully");
  };

  const handleConfirmDeactivation = async () => {
    if (!admin?.id) return;
    try {
      await deactivateAccount(admin.id);
      handleLogout();
    } catch (err) {
      // Error handled by hook
    }
  };

  if (subPage === "account-info") {
    return <AccountInfo admin={admin} onBack={() => navigateTo(null)} />;
  }

  if (subPage === "account-security") {
    return <AccountSecurity admin={admin} onBack={() => navigateTo(null)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">Portal Settings</h2>
        <p className="text-sm text-muted-foreground font-medium">Manage your administrative environment and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Settings Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Account Management</h3>
          <div className="space-y-3">
            <SettingsCard
              icon={User}
              title="Account Information"
              description="Update your username, email and profile details"
              onClick={() => navigateTo("account-info")}
            />
            <SettingsCard
              icon={Shield}
              title="Account Security"
              description="Change your password and manage security preferences"
              onClick={() => navigateTo("account-security")}
            />
          </div>
        </div>

        {/* Theme & Notifications Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Preferences</h3>
          <div className="space-y-3">
            <SettingsCard
              icon={Palette}
              title="Theme Provider"
              description="Personalize your dashboard appearance"
              onClick={() => openModal("theme")}
            />
            <SettingsCard
              icon={BellOff}
              title="Mute Notifications"
              description="Temporarily silence system alerts"
              badge="Coming Soon"
              disabled
            />
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="space-y-4 lg:col-span-2">
          <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] ml-1">Danger Zone</h3>
          <Card className="border-red-500/20 dark:border-red-500/10 overflow-hidden" hover={false}>
            <div className="divide-y divide-red-500/10">
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                    <UserX className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Deactivate Account</p>
                    <p className="text-xs text-muted-foreground">Instantly revoke your access to the admin portal</p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  className="w-full sm:w-auto border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold"
                  onClick={() => openModal("deactivate")}
                >
                  Deactivate
                </Button>
              </div>

              <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-red-500/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center border border-foreground/10">
                    <LogOut className="w-6 h-6 text-foreground/60" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Sign Out</p>
                    <p className="text-xs text-muted-foreground">Terminate your current administrative session</p>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full sm:w-auto font-black uppercase tracking-widest px-8"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ThemeProviderModal 
        isOpen={isThemeModalOpen} 
        onClose={closeModal} 
      />

      <DeactivateAccountModal
        isOpen={isDeactivateModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDeactivation}
      />
    </div>
  );
}

interface SettingsCardProps {
  icon: any;
  title: string;
  description: string;
  onClick?: () => void;
  badge?: string;
  disabled?: boolean;
}

const SettingsCard = ({ icon: Icon, title, description, onClick, badge, disabled }: SettingsCardProps) => (
  <Card 
    onClick={disabled ? undefined : onClick}
    className={`p-4 sm:p-5 flex items-center gap-4 transition-all group ${disabled ? "opacity-60 grayscale cursor-not-allowed" : "cursor-pointer hover:border-secondary/30 hover:bg-secondary/5"}`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${disabled ? "bg-muted border-muted" : "bg-secondary/10 border-secondary/20 group-hover:bg-secondary group-hover:text-white"}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <p className="font-bold text-foreground">{title}</p>
        {badge && (
          <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 bg-secondary/10 text-secondary rounded-full border border-secondary/20">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    {!disabled && (
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
    )}
  </Card>
);
