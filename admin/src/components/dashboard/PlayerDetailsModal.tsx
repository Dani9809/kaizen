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
  Edit2,
  Save,
  X,
  ShieldAlert,
  Check,
  RefreshCw,
  Ban
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
import { CurrencyPresets, CURRENCY_PRESETS } from "@/components/ui/CurrencyPresets";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface PlayerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  playerId: number | null;
}

export default function PlayerDetailsModal({ isOpen, onClose, onSuccess, playerId }: PlayerDetailsModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
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
    confirmPassword: "",
    currency_balance: 0,
    account_created: "",
    account_updated: "",
  });

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";
  const showMatchError = formData.confirmPassword !== "" && !passwordsMatch;

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    if (formData.password) {
      setPasswordValidation(validatePassword(formData.password));
    } else {
      // If empty, reset to false (since it's optional, but we want to show it's not "satisfied" if not typed)
      // Actually, let's keep it false when empty so user knows requirements for a NEW password.
      setPasswordValidation({ length: false, uppercase: false, lowercase: false, number: false, special: false });
    }
  }, [formData.password]);

  useEffect(() => {
    if (isOpen && playerId) {
      fetchMetadata();
      fetchUserDetails();
    }
    setIsEditMode(false);
  }, [isOpen, playerId]);

  const fetchMetadata = async () => {
    try {
      const data = await apiFetch("/admin/metadata");
      setMetadata(data);
    } catch (err) {
      toast.error("Failed to load metadata");
    }
  };

  const fetchUserDetails = async () => {
    if (!playerId) return;
    setFetching(true);
    try {
      const data = await apiFetch(`/admin/users/${playerId}`);
      setFormData({
        type_id: String(data.type_id),
        account_status_id: String(data.account_status_id),
        subscription_tier_id: String(data.subscription_tier_id),
        username: data.username,
        email: data.email,
        password: "", // Don't show password
        confirmPassword: "",
        currency_balance: data.currency_balance,
        account_created: data.account_created,
        account_updated: data.account_updated,
      });
    } catch (err) {
      toast.error("Failed to load player details");
      onClose();
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const body: any = {
        type_id: Number(formData.type_id),
        account_status_id: Number(formData.account_status_id),
        subscription_tier_id: Number(formData.subscription_tier_id),
        username: formData.username,
        email: formData.email,
        currency_balance: Number(formData.currency_balance),
      };
      
      if (formData.password) {
        if (!Object.values(passwordValidation).every(Boolean)) {
          toast.error("New password does not meet requirements");
          return;
        }
        body.password = formData.password;
      }

      await apiFetch(`/admin/users/${playerId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      
      toast.success("Player updated successfully!");
      setIsEditMode(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to update player");
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async () => {
    setLoading(true);
    try {
      await apiFetch(`/admin/users/${playerId}`, {
        method: "PATCH",
        body: JSON.stringify({
          account_status_id: 2, // Suspended Status
        }),
      });
      toast.success("Account suspended successfully");
      setIsConfirmOpen(false);
      handleClose();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to suspend account");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("id");
    router.replace(`?${params.toString()}`, { scroll: false });
    onClose();
  };

  const handleGeneratePassword = () => {
    const newPass = generatePassword(14);
    setFormData({ ...formData, password: newPass, confirmPassword: newPass });
    toast.success("Strong password generated");
  };

  const footer = (
    <div className="flex items-center justify-end w-full gap-2">
      {isEditMode ? (
         <Button variant="secondary" size="md" onClick={() => setIsEditMode(false)}>
           Cancel
         </Button>
      ) : (
         <Button variant="secondary" size="md" onClick={handleClose}>
           Close
         </Button>
      )}
      <div className="flex items-center gap-2">
        {isEditMode ? (
          <Button 
            variant="gradient" 
            size="md" 
            onClick={handleUpdate} 
            loading={loading}
            className="gap-2"
          >
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        ) : (
          <Button 
            variant="gradient" 
            size="md" 
            onClick={() => setIsEditMode(true)}
            className="gap-2"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Player Profile" : "Player Information"}
      size="lg"
      footer={footer}
    >
      {fetching ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <RefreshCw className="w-8 h-8 text-secondary animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fetching player data...</p>
        </div>
      ) : (
        <>
          <div className="animate-in fade-in duration-500 space-y-4">
            {isEditMode ? (
              <div className="space-y-4 animate-in slide-in-from-bottom-4">
                {/* Identity Section */}
                <div className="p-4 sm:p-6 bg-secondary/5 rounded-3xl border border-secondary/10 space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                    <User className="w-4 h-4" /> Account Identity
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Username"
                      icon={User}
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <Input
                      label="Email Address"
                      icon={Mail}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Administrative Section */}
                <div className="p-4 sm:p-6 bg-white dark:bg-card rounded-3xl border border-secondary/20 shadow-lg space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Level & Status Configuration</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select
                      icon={User}
                      label="Player Rank"
                      options={metadata.types.map(t => ({ value: String(t.type_id), label: t.type_name }))}
                      value={formData.type_id}
                      onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
                    />
                    <Select
                      icon={CreditCard}
                      label="Subscription"
                      options={metadata.tiers.map(t => ({ value: String(t.subscription_tier_id), label: t.subscription_tier_name }))}
                      value={formData.subscription_tier_id}
                      onChange={(e) => setFormData({ ...formData, subscription_tier_id: e.target.value })}
                    />
                    <Select
                      icon={Shield}
                      label="Current Status"
                      options={metadata.statuses.map(s => ({ value: String(s.account_status_id), label: s.account_status_name }))}
                      value={formData.account_status_id}
                      onChange={(e) => setFormData({ ...formData, account_status_id: e.target.value })}
                    />
                  </div>
                  <div className="pt-4 border-t border-secondary/5">
                    <div className="grid grid-cols-1 gap-6 items-start">
                       <Input
                          label="KAI Balance"
                          icon={Zap}
                          type="text"
                          value={Number(formData.currency_balance).toLocaleString()}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, '');
                            if (rawValue === "" || !isNaN(Number(rawValue))) {
                              setFormData({ ...formData, currency_balance: rawValue === "" ? 0 : Number(rawValue) });
                            }
                          }}
                          className="text-xl font-black text-secondary"
                       />
                       <div className="space-y-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quick Selection Presets</p>
                          <CurrencyPresets 
                            presets={CURRENCY_PRESETS} 
                            currentValue={formData.currency_balance}
                            onSelect={(val) => setFormData({ ...formData, currency_balance: val })}
                          />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="p-4 sm:p-6 bg-secondary/5 rounded-3xl border border-secondary/10 space-y-6">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Security Override
                  </h5>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <PasswordField
                        label="Force New Password"
                        placeholder="Enter new password to reset..."
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        generateAction={
                          <button 
                            onClick={handleGeneratePassword}
                            className="text-[9px] font-black uppercase tracking-widest text-secondary hover:text-secondary/80 transition-colors flex items-center gap-1"
                          >
                            <RefreshCw className="w-2.5 h-2.5" /> Generate Strong
                          </button>
                        }
                      />

                      <div className="space-y-2">
                        <PasswordField
                          label="Confirm Override Password"
                          placeholder="Repeat new password..."
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className={showMatchError ? "border-red-500/50 focus:border-red-500" : ""}
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

                    <div className="p-4 bg-background/50 rounded-2xl border border-secondary/10 space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">Requirements Status</p>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                          { key: 'length', label: '8+ chars' },
                          { key: 'uppercase', label: 'Upper' },
                          { key: 'lowercase', label: 'Lower' },
                          { key: 'number', label: 'Number' },
                          { key: 'special', label: 'Special' },
                        ].map((req) => (
                          <div key={req.key} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${passwordValidation[req.key as keyof typeof passwordValidation] ? 'bg-secondary text-white' : 'bg-secondary/5 text-muted-foreground/20 border border-secondary/10'}`}>
                              <Check className="w-2.5 h-2.5" />
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-tight ${passwordValidation[req.key as keyof typeof passwordValidation] ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[9px] text-muted-foreground/80 italic">* Leave blank to keep the player's current password. If providing a new one, it must meet all requirements.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-500">
                {/* Hero Section */}
                <div className="relative overflow-hidden p-4 sm:p-6 bg-secondary/5 rounded-3xl border border-secondary/10">
                   <div className="absolute top-0 right-0 p-6">
                      <Badge variant={formData.account_status_id === "1" ? "success" : "danger"} dot className="px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                        {metadata.statuses.find(s => String(s.account_status_id) === formData.account_status_id)?.account_status_name || "Active"}
                      </Badge>
                   </div>
                   <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      <div className="w-16 h-16 bg-white dark:bg-card rounded-2xl shadow-xl flex items-center justify-center border border-secondary/20 shrink-0">
                         <UserCircle className="w-8 h-8 text-secondary" />
                      </div>
                      <div className="text-center sm:text-left space-y-0.5 min-w-0 flex-1">
                         <h4 className="font-heading font-black text-xl uppercase tracking-tight text-foreground leading-none truncate">
                           {formData.username}
                         </h4>
                         <p className="text-xs font-bold text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 truncate">
                           <Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{formData.email}</span>
                         </p>
                         <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                            <Badge variant="neutral" className="px-2 py-0.5 text-[8px] bg-secondary/10 text-secondary border-secondary/20">
                              {metadata.types.find(t => String(t.type_id) === formData.type_id)?.type_name || "USER"}
                            </Badge>
                            <Badge variant="info" className="px-2 py-0.5 text-[8px] uppercase">
                              {metadata.tiers.find(t => String(t.subscription_tier_id) === formData.subscription_tier_id)?.subscription_tier_name || "FREE"} TIER
                            </Badge>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Economy Section */}
                <div className="p-0.5 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl">
                  <div className="p-4 sm:p-6 bg-white dark:bg-card rounded-[1.4rem] flex items-center justify-between shadow-sm">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-secondary">Available Kai</p>
                      <h3 className="text-2xl font-black text-foreground tracking-tight truncate">
                        {Number(formData.currency_balance).toLocaleString()} <span className="text-secondary">KAI</span>
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center border border-secondary/20 shrink-0 ml-4">
                       <Zap className="w-6 h-6 text-secondary fill-secondary" />
                    </div>
                  </div>
                </div>

                {/* Main Information Stack */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Security Info */}
                  <div className="p-4 sm:p-5 bg-secondary/5 rounded-3xl border border-secondary/10 space-y-3">
                     <h5 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <Shield className="w-3 h-3" /> Security Profile
                     </h5>
                     <div className="space-y-3">
                        <div className="flex items-center justify-between group min-w-0">
                           <span className="text-[9px] font-bold text-muted-foreground/70 uppercase shrink-0">Login ID</span>
                           <span className="text-xs font-black truncate ml-4">{formData.username}</span>
                        </div>
                        <div className="flex items-center justify-between group border-t border-secondary/5 pt-3 min-w-0">
                           <span className="text-[9px] font-bold text-muted-foreground/70 uppercase shrink-0">Email</span>
                           <span className="text-xs font-black truncate ml-4">{formData.email}</span>
                        </div>
                     </div>
                  </div>

                  {/* System Info */}
                  <div className="p-4 sm:p-5 bg-secondary/5 rounded-3xl border border-secondary/10 space-y-3">
                     <h5 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <ShieldAlert className="w-3 h-3" /> System Metrics
                     </h5>
                     <div className="space-y-3">
                         <div className="flex items-center justify-between group min-w-0">
                            <span className="text-[9px] font-bold text-muted-foreground/70 uppercase shrink-0">Joined</span>
                            <span className="text-[10px] font-black truncate ml-4">
                              {formData.account_created ? new Date(formData.account_created).toLocaleString('en-US', { 
                                month: 'short', day: 'numeric', year: 'numeric', 
                                hour: '2-digit', minute: '2-digit'
                              }) : "---"}
                            </span>
                         </div>
                         <div className="flex items-center justify-between group border-t border-secondary/5 pt-3">
                            <span className="text-[9px] font-bold text-muted-foreground/70 uppercase shrink-0">Updated</span>
                            <span className="text-[10px] font-black truncate ml-4 text-secondary">
                              {formData.account_updated ? new Date(formData.account_updated).toLocaleString('en-US', { 
                                month: 'short', day: 'numeric', year: 'numeric', 
                                hour: '2-digit', minute: '2-digit'
                              }) : "---"}
                            </span>
                         </div>
                     </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 sm:p-5 bg-red-500/5 rounded-3xl border border-red-500/10 space-y-3 animate-in slide-in-from-right-2">
                     <div className="space-y-0.5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-red-500">Critical</p>
                        <p className="text-[8px] text-red-500/50 leading-tight italic">Can be updated via edit button.</p>
                     </div>
                     <Button 
                       variant="primary" 
                       size="sm" 
                       onClick={() => setIsConfirmOpen(true)}
                       loading={loading}
                       disabled={formData.account_status_id === "2"}
                       className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10 gap-2 font-black uppercase tracking-widest text-[9px]"
                     >
                        <Ban className="w-3.5 h-3.5" /> {formData.account_status_id === "2" ? "Suspended" : "Suspend"}
                     </Button>
                  </div>

                  <div className="p-4 sm:p-5 bg-white dark:bg-card rounded-3xl border border-secondary/10 space-y-3 shadow-sm">
                     <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Tools</p>
                     <div className="space-y-1.5">
                        <Button variant="primary" size="sm" className="w-full justify-start gap-2 font-bold text-[10px] uppercase">
                           <Mail className="w-3.5 h-3.5" /> Message
                        </Button>
                        <Button variant="primary" size="sm" className="w-full justify-start gap-2 font-bold text-[10px] uppercase">
                           <ShieldAlert className="w-3.5 h-3.5" /> Audit Logs
                        </Button>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <ConfirmationModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleTerminate}
            title="Suspend Account"
            description={`Are you sure you want to suspend ${formData.username}'s account? They will lose access to the platform immediately.`}
            confirmLabel="Yes, Suspend"
            variant="danger"
            loading={loading}
          />
        </>
      )}
    </Modal>
  );
}
