"use client";

import React, { useState, useEffect, useCallback } from "react";
import { User, Mail, Save, ArrowLeft, Loader2, Edit3, X, Calendar, Zap, TrendingUp, Award, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSettings } from "../hooks/useSettings";
import { apiFetch } from "@/lib/api";
import { CurrencyPresets, CURRENCY_PRESETS } from "@/components/ui/CurrencyPresets";

interface AccountInfoProps {
  onBack: () => void;
  admin: any;
}

interface FormData {
  username: string;
  email: string;
  subscription_tier_id: number;
  currency_balance: number;
}

export const AccountInfo = ({ onBack, admin: basicAdmin }: AccountInfoProps) => {
  const { fetchProfile, updateAccountInfo, loading } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    subscription_tier_id: 1,
    currency_balance: 0,
  });

  const loadData = useCallback(async () => {
    if (!basicAdmin?.id) return;
    try {
      const [profileData, metadata] = await Promise.all([
        fetchProfile(basicAdmin.id),
        apiFetch("/admin/metadata")
      ]);
      setProfile(profileData);
      setTiers(metadata.tiers);
      setFormData({
        username: profileData.username,
        email: profileData.email,
        subscription_tier_id: profileData.subscription_tier_id,
        currency_balance: Number(profileData.currency_balance),
      });
    } catch (err) {
      // Error handled by hook
    }
  }, [basicAdmin?.id, fetchProfile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicAdmin?.id) return;
    
    try {
      await updateAccountInfo(basicAdmin.id, {
        ...formData,
        currency_balance: Number(formData.currency_balance),
        account_updated: new Date()
      });
      setIsEditing(false);
      loadData(); // Refresh to get updated account_updated timestamp
    } catch (err) {
      // Error handled by hook
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-secondary/10 rounded-xl text-muted-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Account Information</h2>
            <p className="text-xs text-muted-foreground font-medium">
              {isEditing ? "Editing your administrative profile" : "Viewing your administrative profile details"}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {isEditing ? (
            <Button 
              variant="secondary" 
              size="md" 
              onClick={() => setIsEditing(false)}
              className="gap-2 font-bold"
            >
              <X className="w-4 h-4" /> Cancel
            </Button>
          ) : (
            <Button 
              variant="gradient" 
              size="md" 
              onClick={() => setIsEditing(true)}
              className="gap-2 font-black uppercase tracking-widest shadow-lg shadow-secondary/20"
            >
              <Edit3 className="w-4 h-4" /> Edit Information
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="h-full overflow-hidden" hover={false}>
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 bg-secondary/10 rounded-[2rem] flex items-center justify-center border-2 border-secondary/20 shadow-inner">
                  <User className="w-12 h-12 text-secondary" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-background border-4 border-card rounded-full flex items-center justify-center text-secondary shadow-sm">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xl font-black text-foreground uppercase tracking-tight">{profile.username}</p>
                <p className="text-xs text-muted-foreground font-medium">{profile.email}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <Badge variant="info" dot>{profile.type?.type_name}</Badge>
                <Badge variant="success">{profile.tier?.subscription_tier_name}</Badge>
              </div>

              <div className="w-full pt-6 border-t border-secondary/5 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Balance</p>
                    <p className="text-lg font-black text-secondary">${profile.currency_balance}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Streak</p>
                    <p className="text-lg font-black text-amber-500">{profile.current_streak}d</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Info / Form */}
        <div className="lg:col-span-2">
          <Card className="h-full overflow-hidden" hover={false}>
            <div className="p-8">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Username</label>
                      <Input
                        icon={User}
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={(e) => setFormData((prev: FormData) => ({ ...prev, username: e.target.value }))}
                        className="bg-secondary/5 border-secondary/10 font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Email Address</label>
                      <Input
                        icon={Mail}
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev: FormData) => ({ ...prev, email: e.target.value }))}
                        className="bg-secondary/5 border-secondary/10 font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Subscription Tier</label>
                      <select
                        value={formData.subscription_tier_id}
                        onChange={(e) => setFormData((prev: FormData) => ({ ...prev, subscription_tier_id: Number(e.target.value) }))}
                        className="w-full px-4 py-2.5 bg-secondary/5 border border-secondary/10 rounded-xl text-sm font-semibold focus:border-secondary/30 focus:ring-0 transition-all outline-none appearance-none cursor-pointer"
                      >
                        {tiers.map(tier => (
                          <option key={tier.subscription_tier_id} value={tier.subscription_tier_id}>
                            {tier.subscription_tier_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Currency Balance</label>
                      <Input
                        icon={DollarSign}
                        type="number"
                        placeholder="Enter balance"
                        value={formData.currency_balance}
                        onChange={(e) => setFormData((prev: FormData) => ({ ...prev, currency_balance: Number(e.target.value) }))}
                        className="bg-secondary/5 border-secondary/10 font-semibold"
                        required
                      />
                      <CurrencyPresets 
                        presets={CURRENCY_PRESETS} 
                        onSelect={(val) => setFormData((prev: FormData) => ({ ...prev, currency_balance: val }))}
                        currentValue={formData.currency_balance}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-secondary/5">
                    <Button 
                      variant="gradient" 
                      size="lg" 
                      type="submit" 
                      disabled={loading}
                      className="w-full sm:w-auto gap-2 px-12 font-black uppercase tracking-widest shadow-lg shadow-secondary/20"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <InfoField icon={Award} label="Subscription Tier" value={profile.tier?.subscription_tier_name} />
                    <InfoField icon={DollarSign} label="Currency Balance" value={`$${profile.currency_balance}`} />
                    <InfoField icon={TrendingUp} label="Current Streak" value={`${profile.current_streak} Days`} />
                    <InfoField icon={Zap} label="Longest Streak" value={`${profile.longest_streak} Days`} />
                    <InfoField icon={Calendar} label="Last Freeze Used" value={formatDate(profile.last_freeze_used_date)} />
                    <InfoField icon={Calendar} label="Member Since" value={formatDate(profile.account_created)} />
                  </div>

                  <div className="pt-8 border-t border-secondary/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-secondary/5 rounded-2xl border border-secondary/10 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-muted-foreground shadow-sm shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Last Account Update</p>
                          <p className="text-sm font-bold text-foreground truncate">{formatDate(profile.account_updated)}</p>
                        </div>
                      </div>
                      <Badge variant="neutral" className="w-fit">System Logged</Badge>
                    </div>
                  </div>

                  {/* Mobile Edit Button */}
                  <div className="sm:hidden pt-6">
                    <Button 
                      variant="gradient" 
                      size="lg" 
                      onClick={() => setIsEditing(true)}
                      className="w-full gap-2 font-black uppercase tracking-widest shadow-lg shadow-secondary/20"
                    >
                      <Edit3 className="w-4 h-4" /> Edit Information
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Mobile Cancel Button when Editing */}
      {isEditing && (
        <div className="sm:hidden mt-6">
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={() => setIsEditing(false)}
            className="w-full gap-2 font-bold"
          >
            <X className="w-4 h-4" /> Cancel Editing
          </Button>
        </div>
      )}
    </div>
  );
};

const InfoField = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-10 h-10 bg-secondary/5 rounded-xl flex items-center justify-center text-muted-foreground border border-secondary/5 group-hover:bg-secondary group-hover:text-white group-hover:border-secondary transition-all">
      <Icon className="w-5 h-5" />
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  </div>
);
