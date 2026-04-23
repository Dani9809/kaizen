"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Shield,
  Zap,
  Mail,
  Lock,
  UserCircle,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  RefreshCw,
  Check,
  Circle,
  X,
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { generatePassword, validatePassword } from "@/lib/password";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";
import { PasswordField } from "@/components/ui/PasswordField";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CurrencyPresets } from "@/components/ui/CurrencyPresets";

interface NewPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewPlayerModal({ isOpen, onClose, onSuccess }: NewPlayerModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<{
    types: any[];
    statuses: any[];
    tiers: any[];
  }>({ types: [], statuses: [], tiers: [] });

  const [formData, setFormData] = useState({
    type_id: "",
    account_status_id: "",
    subscription_tier_id: "",
    username: "",
    email: "",
    password: "",
    currency_balance: "" as any as number,
  });

  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const isAccountValid = formData.type_id !== "" && formData.account_status_id !== "" && formData.subscription_tier_id !== "";
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isSecurityValid = isEmailValid && usernameStatus === 'available' && Object.values(validatePassword(formData.password)).every(Boolean);
  const isGameValid = formData.currency_balance !== "" as any as number || formData.currency_balance === 0;

  useEffect(() => {
    if (formData.username.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const { available } = await apiFetch(`/admin/check-username?username=${formData.username}`);
        setUsernameStatus(available ? 'available' : 'taken');
      } catch (err) {
        setUsernameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setPasswordValidation(validatePassword(formData.password));
  }, [formData.password]);

  const canNavigateTo = (tabId: string) => {
    if (tabId === "account") return true;
    if (tabId === "security") return isAccountValid;
    if (tabId === "game") return isAccountValid && isSecurityValid;
    if (tabId === "summary") return isAccountValid && isSecurityValid && isGameValid;
    return false;
  };

  const handleGeneratePassword = () => {
    const newPass = generatePassword(14);
    setFormData({ ...formData, password: newPass });
    toast.success("Strong password generated");
  };

  // Sync state with URL
  useEffect(() => {
    if (isOpen) {
      const action = searchParams.get("action");
      const step = searchParams.get("step");
      
      if (action === "add-player") {
        if (step && ["account", "security", "game", "summary"].includes(step)) {
          if (!canNavigateTo(step)) {
            updateUrl("account");
            setActiveTab("account");
          } else {
            setActiveTab(step);
          }
        } else {
          updateUrl("account");
        }
      }
    }
  }, [isOpen, searchParams, isAccountValid, isSecurityValid, isGameValid]);

  const updateUrl = (step: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (step) {
      params.set("action", "add-player");
      params.set("step", step);
    } else {
      params.delete("action");
      params.delete("step");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleTabChange = (id: string) => {
    if (!canNavigateTo(id)) {
      toast.error("Please complete the current step first");
      return;
    }
    setActiveTab(id);
    updateUrl(id);
  };

  const handleClose = () => {
    onClose();
    // Reset form after a short delay to allow transition to finish
    setTimeout(() => {
      setFormData({
        type_id: "",
        account_status_id: "",
        subscription_tier_id: "",
        username: "",
        email: "",
        password: "",
        currency_balance: "" as any as number,
      });
      setActiveTab("account");
      setUsernameStatus('idle');
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      fetchMetadata();
    }
  }, [isOpen]);

  const fetchMetadata = async () => {
    try {
      const data = await apiFetch("/admin/metadata");
      setMetadata(data);
      // Set defaults
      if (data.types.length > 0) {
        setFormData(prev => ({
          ...prev,
          type_id: data.types.find((t: any) => t.type_name === 'User')?.type_id || data.types[0].type_id,
          account_status_id: data.statuses.find((s: any) => s.account_status_name === 'Active')?.account_status_id || data.statuses[0].account_status_id,
          subscription_tier_id: data.tiers.find((t: any) => t.subscription_tier_name === 'Free')?.subscription_tier_id || data.tiers[0].subscription_tier_id,
        }));
      }
    } catch (err) {
      toast.error("Failed to load metadata");
    }
  };

  const tabs = [
    { id: "account", label: "Account", icon: UserCircle },
    { id: "security", label: "Security", icon: Shield },
    { id: "game", label: "Game", icon: Zap },
    { id: "summary", label: "Summary", icon: CheckCircle2 },
  ];

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all required security fields");
      setActiveTab("security");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/admin/users", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          type_id: Number(formData.type_id),
          account_status_id: Number(formData.account_status_id),
          subscription_tier_id: Number(formData.subscription_tier_id),
          currency_balance: Number(formData.currency_balance || 0),
        }),
      });
      toast.success("Player created successfully!");
      onSuccess();
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create player");
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-1">
        {tabs.map((t, i) => (
          <div
            key={t.id}
            className={`h-1 rounded-full transition-all duration-500 ${activeTab === t.id ? 'w-8 bg-secondary' : 'w-2 bg-secondary/20'}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="primary" size="md" onClick={handleClose}>Cancel</Button>
        {activeTab === "summary" ? (
          <Button
            variant="gradient"
            size="md"
            onClick={handleSubmit}
            loading={loading}
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Confirm & Create
          </Button>
        ) : (
          <Button
            variant="gradient"
            size="md"
            disabled={
              (activeTab === "account" && !isAccountValid) ||
              (activeTab === "security" && !isSecurityValid) ||
              (activeTab === "game" && !isGameValid)
            }
            onClick={() => {
              const currentIndex = tabs.findIndex(t => t.id === activeTab);
              handleTabChange(tabs[currentIndex + 1].id);
            }}
            className="gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Player"
      size="lg"
      footer={footer}
    >
      <div className="space-y-8">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

        <div className="min-h-[280px] animate-in slide-in-from-bottom-4 duration-500">
          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Select
                  label="Account Type"
                  icon={Shield}
                  options={metadata.types.map(t => ({ value: t.type_id, label: t.type_name }))}
                  value={formData.type_id}
                  onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
                />
                <Select
                  label="Initial Status"
                  icon={User}
                  options={metadata.statuses.map(s => ({ value: s.account_status_id, label: s.account_status_name }))}
                  value={formData.account_status_id}
                  onChange={(e) => setFormData({ ...formData, account_status_id: e.target.value })}
                />
              </div>
              <Select
                label="Subscription Tier"
                icon={CreditCard}
                options={metadata.tiers.map(t => ({ value: t.subscription_tier_id, label: t.subscription_tier_name }))}
                value={formData.subscription_tier_id}
                onChange={(e) => setFormData({ ...formData, subscription_tier_id: e.target.value })}
              />
              <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Account Defaults</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Initial Streak</p>
                    <p className="font-bold text-sm">0 Days</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Freeze Status</p>
                    <p className="font-bold text-sm text-amber-500">Available</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <Input
                label="Username"
                icon={User}
                placeholder="Enter unique username..."
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                maxLength={20}
                rightElement={
                  <div className="mr-2">
                    {usernameStatus === 'checking' && <RefreshCw className="w-4 h-4 text-secondary animate-spin" />}
                    {usernameStatus === 'available' && <Check className="w-4 h-4 text-green-500" />}
                    {usernameStatus === 'taken' && <X className="w-4 h-4 text-red-500" />}
                  </div>
                }
              />
              {usernameStatus === 'taken' && <p className="text-[10px] text-red-500 ml-1 mt-1 font-bold uppercase tracking-tight">Username is already taken</p>}
              {usernameStatus === 'available' && <p className="text-[10px] text-green-500 ml-1 mt-1 font-bold uppercase tracking-tight">Username is available</p>}
              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="Enter player email..."
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                maxLength={100}
              />
              <PasswordField
                label="Temporary Password"
                placeholder="Create a secure password..."
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                generateAction={
                  <button
                    onClick={handleGeneratePassword}
                    className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-secondary/80 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Generate Strong
                  </button>
                }
              />

              {/* Password Requirements */}
              <div className="mt-4 grid grid-cols-2 gap-2 p-3 bg-secondary/5 rounded-2xl border border-secondary/10">
                {[
                  { key: 'length', label: '8+ Characters' },
                  { key: 'uppercase', label: 'Uppercase Letter' },
                  { key: 'lowercase', label: 'Lowercase Letter' },
                  { key: 'number', label: 'Number' },
                  { key: 'special', label: 'Special Character' },
                ].map((req) => (
                  <div key={req.key} className="flex items-center gap-2">
                    {passwordValidation[req.key as keyof typeof passwordValidation] ? (
                      <Check className="w-3 h-3 text-secondary" />
                    ) : (
                      <Circle className="w-3 h-3 text-foreground/20" />
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${passwordValidation[req.key as keyof typeof passwordValidation] ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground/80 mt-2 italic">* Password will be hashed with 12 rounds before storage.</p>
            </div>
          )}

          {activeTab === "game" && (
            <div className="space-y-6">
              <div className="p-8 bg-gradient-to-br from-secondary/10 to-primary/5 rounded-3xl border border-secondary/20 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-card rounded-2xl shadow-xl flex items-center justify-center mb-4 border border-secondary/20 animate-bounce">
                  <Zap className="w-8 h-8 text-secondary fill-secondary" />
                </div>
                <h4 className="font-heading font-black text-xl uppercase tracking-tight text-foreground">Starting Economy</h4>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">Set the initial currency balance for this player's journey.</p>
              </div>

              <Input
                label="Initial Balance (KAI)"
                icon={Zap}
                type="text"
                placeholder="0.00"
                value={formData.currency_balance === "" as any as number ? "" : Number(formData.currency_balance).toLocaleString()}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, '');
                  if (rawValue === "" || !isNaN(Number(rawValue))) {
                    setFormData({ ...formData, currency_balance: rawValue === "" ? "" as any as number : Number(rawValue) });
                  }
                }}
                className="text-2xl font-black text-secondary"
              />

              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quick Presets</p>
                 <CurrencyPresets 
                   presets={[500, 1000, 10000, 100000, 1000000]}
                   currentValue={formData.currency_balance}
                   onSelect={(val) => setFormData({ ...formData, currency_balance: val })}
                 />
              </div>
            </div>
          )}

          {activeTab === "summary" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                   <Shield className="w-4 h-4" /> Final Review
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Account Info</p>
                        <p className="text-sm font-bold">{metadata.types.find(t => t.type_id === Number(formData.type_id))?.type_name} • {metadata.tiers.find(t => t.subscription_tier_id === Number(formData.subscription_tier_id))?.subscription_tier_name}</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Security</p>
                        <p className="text-sm font-bold">{formData.username}</p>
                        <p className="text-xs text-foreground/60">{formData.email}</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Economy</p>
                        <p className="text-sm font-black text-secondary">{Number(formData.currency_balance || 0).toLocaleString()} KAI</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Status</p>
                        <Badge variant="success" dot>Active</Badge>
                     </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-start gap-3">
                 <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                 <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-tight">Security Check</p>
                    <p className="text-[10px] text-amber-600/70 leading-relaxed">Ensure you have shared the temporary password with the player. For security, passwords are stored using one-way 12-round hashing and cannot be recovered.</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
