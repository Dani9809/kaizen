"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  User, 
  Mail, 
  Shield, 
  Zap, 
  Calendar, 
  Clock, 
  Layout, 
  Target, 
  Award, 
  Box, 
  Heart, 
  ShieldAlert,
  Edit2,
  Lock,
  MessageSquare,
  Ban,
  TrendingUp,
  Save,
  RefreshCw,
  Check,
  Smile,
  XCircle,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { fetchPlayerDetails, updatePlayer } from "../api/players";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PasswordField } from "@/components/ui/PasswordField";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { CurrencyPresets, CURRENCY_PRESETS } from "@/components/ui/CurrencyPresets";
import { generatePassword, validatePassword } from "@/lib/password";
import { DetailsHeader } from "@/components/ui/DetailsHeader";

interface PlayerDetailsProps {
  id: string | number;
}

export default function PlayerDetails({ id }: PlayerDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditMode, setIsEditMode] = useState(false);
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
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false, uppercase: false, lowercase: false, number: false, special: false
  });

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";
  const showMatchError = formData.confirmPassword !== "" && !passwordsMatch;

  const loadPlayerDetails = useCallback(async () => {
    try {
      const data = await fetchPlayerDetails(id);
      setPlayer(data);
      setFormData({
        type_id: String(data.type_id),
        account_status_id: String(data.account_status_id),
        subscription_tier_id: String(data.subscription_tier_id),
        username: data.username,
        email: data.email,
        password: "",
        confirmPassword: "",
        currency_balance: Number(data.currency_balance),
      });
    } catch (err) {
      toast.error("Failed to fetch player details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMetadata = async () => {
    try {
      const data = await apiFetch("/admin/metadata");
      setMetadata(data);
    } catch (err) {
      toast.error("Failed to load metadata");
    }
  };

  useEffect(() => {
    loadPlayerDetails();
    fetchMetadata();
  }, [loadPlayerDetails]);

  useEffect(() => {
    if (formData.password) {
      setPasswordValidation(validatePassword(formData.password));
    } else {
      setPasswordValidation({ length: false, uppercase: false, lowercase: false, number: false, special: false });
    }
  }, [formData.password]);

  const tabs = [
    { id: "overview", label: "Overview", icon: Layout },
    { id: "tasks", label: "Tasks", icon: Target },
    { id: "quests", label: "Quests", icon: Award },
    { id: "squads", label: "Squads", icon: User },
    { id: "inventory", label: "Inventory", icon: Box },
    { id: "reflections", label: "Reflections", icon: Smile },
    { id: "security", label: "Security", icon: Lock },
  ];

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/dashboard?view=users/id=${id}&tab=${tabId}`, { scroll: false });
  };

  const handleUpdate = async () => {
    setUpdating(true);
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

      await updatePlayer(id, body);
      toast.success("Player updated successfully!");
      setIsEditMode(false);
      loadPlayerDetails();
    } catch (err: any) {
      toast.error(err.message || "Failed to update player");
    } finally {
      setUpdating(false);
    }
  };

  const handleSuspend = async () => {
    setUpdating(true);
    try {
      await updatePlayer(id, { account_status_id: 2 });
      toast.success("Account suspended successfully");
      setIsConfirmOpen(false);
      loadPlayerDetails();
    } catch (err: any) {
      toast.error(err.message || "Failed to suspend account");
    } finally {
      setUpdating(false);
    }
  };

  const handleGeneratePassword = () => {
    const newPass = generatePassword(14);
    setFormData({ ...formData, password: newPass, confirmPassword: newPass });
    toast.success("Strong password generated");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
        <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-bold">Player not found</p>
        <BackButton href="/dashboard?view=users" className="mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <DetailsHeader
        title={player.username}
        backHref="/dashboard?view=users"
        badgeText={player.status?.account_status_name}
        badgeVariant={player.status?.account_status_name === 'Active' ? "success" : "danger"}
        metaItems={[
          { icon: Calendar, label: "Joined", value: new Date(player.account_created).toLocaleDateString() },
          { icon: Clock, label: "Updated", value: new Date(player.account_updated).toLocaleDateString() },
          { icon: Mail, label: "", value: player.email },
        ]}
        actions={[
          {
            label: isEditMode ? "Cancel" : "Edit Profile",
            icon: Edit2,
            variant: isEditMode ? "secondary" : "gradient",
            onClick: () => setIsEditMode(!isEditMode)
          },
          {
            label: "Message",
            icon: MessageSquare,
            variant: "primary"
          }
        ]}
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-secondary/5 rounded-2xl w-full sm:w-fit border border-secondary/10 overflow-x-auto custom-scrollbar no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex-1 sm:flex-none
              ${activeTab === tab.id 
                ? "bg-white dark:bg-card text-secondary shadow-sm ring-1 ring-secondary/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/5"}
            `}
          >
            <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? "text-secondary" : ""}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {isEditMode ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
             <Card className="p-6 space-y-6">
                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-secondary flex items-center gap-2 mb-4">
                      <User className="w-4 h-4" /> Identity & Rank
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Username"
                        icon={User}
                        maxLength={20}
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                      <Input
                        label="Email Address"
                        icon={Mail}
                        maxLength={100}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      <Select
                        label="Account Type"
                        icon={Shield}
                        options={metadata.types.map(t => ({ value: String(t.type_id), label: t.type_name }))}
                        value={formData.type_id}
                        onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
                      />
                      <Select
                        label="Subscription Tier"
                        icon={Award}
                        options={metadata.tiers.map(t => ({ value: String(t.subscription_tier_id), label: t.subscription_tier_name }))}
                        value={formData.subscription_tier_id}
                        onChange={(e) => setFormData({ ...formData, subscription_tier_id: e.target.value })}
                      />
                   </div>
                </div>

                <div className="pt-6 border-t border-secondary/10">
                   <h3 className="text-sm font-black uppercase tracking-widest text-secondary flex items-center gap-2 mb-4">
                      <Zap className="w-4 h-4" /> Economy
                   </h3>
                   <div className="space-y-4">
                      <Input
                        label="KAI Balance"
                        icon={Zap}
                        type="number"
                        value={formData.currency_balance}
                        onChange={(e) => setFormData({ ...formData, currency_balance: Number(e.target.value) })}
                        className="text-xl font-black text-secondary"
                      />
                      <CurrencyPresets 
                        presets={CURRENCY_PRESETS} 
                        currentValue={formData.currency_balance}
                        onSelect={(val) => setFormData({ ...formData, currency_balance: val })}
                      />
                   </div>
                </div>

                <div className="pt-6 border-t border-secondary/10 flex justify-end">
                   <Button 
                    variant="gradient" 
                    size="md" 
                    onClick={handleUpdate} 
                    loading={updating}
                    className="gap-2 font-black uppercase"
                   >
                     <Save className="w-4 h-4" /> Save Changes
                   </Button>
                </div>
             </Card>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Kai Balance</p>
                        <h3 className="text-3xl font-black text-foreground font-heading flex items-center gap-2">
                          <Zap className="w-6 h-6 text-amber-500 fill-amber-500" /> {Number(player.currency_balance).toLocaleString()}
                        </h3>
                      </div>
                      <div className="p-3 bg-amber-500/10 rounded-2xl">
                        <TrendingUp className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent border-blue-500/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Current Streak</p>
                        <h3 className="text-3xl font-black text-foreground font-heading flex items-center gap-2">
                          <Zap className="w-6 h-6 text-blue-500 fill-blue-500" /> {player.current_streak}
                        </h3>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Squads</p>
                        <h3 className="text-3xl font-black text-foreground font-heading flex items-center gap-2">
                          <User className="w-6 h-6 text-indigo-500" /> {player.group_memberships?.length || 0}
                        </h3>
                      </div>
                      <div className="p-3 bg-indigo-500/10 rounded-2xl">
                        <Layout className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                     <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2 mb-6">
                        <Clock className="w-4 h-4 text-secondary" /> Recent Nudges
                     </h3>
                     <div className="space-y-4">
                        {[...player.received_nudges, ...player.sent_nudges]
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .slice(0, 5)
                          .map((nudge: any) => (
                            <div key={nudge.nudge_id} className="flex items-start gap-3 p-3 bg-secondary/5 rounded-xl border border-secondary/10">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${nudge.receiver ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                  <MessageSquare className="w-4 h-4" />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">
                                     {nudge.receiver ? `To: ${nudge.receiver.username}` : `From: ${nudge.sender.username}`}
                                  </p>
                                  <p className="text-xs font-medium text-foreground truncate mt-0.5">{nudge.message}</p>
                               </div>
                               <span className="text-[9px] font-bold text-muted-foreground whitespace-nowrap mt-1">
                                  {new Date(nudge.created_at).toLocaleDateString()}
                               </span>
                            </div>
                        ))}
                        {player.received_nudges.length === 0 && player.sent_nudges.length === 0 && (
                          <p className="text-center py-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">No nudges found</p>
                        )}
                     </div>
                  </Card>

                  <Card className="p-6">
                     <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2 mb-6">
                        <Smile className="w-4 h-4 text-secondary" /> Latest Reflections
                     </h3>
                     <div className="space-y-4">
                        {player.reflections.slice(0, 3).map((ref: any) => (
                          <div key={ref.reflection_id} className="space-y-2">
                             <div className="flex items-center justify-between">
                                <Badge variant="neutral" className="text-[9px] uppercase font-black">{ref.mood.mood_label}</Badge>
                                <span className="text-[9px] font-bold text-muted-foreground">{new Date(ref.created_at).toLocaleDateString()}</span>
                             </div>
                             <p className="text-xs text-foreground bg-secondary/5 p-3 rounded-xl border border-secondary/10 leading-relaxed">
                                {ref.content}
                             </p>
                          </div>
                        ))}
                        {player.reflections.length === 0 && (
                          <p className="text-center py-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">No reflections yet</p>
                        )}
                     </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                      <Target className="w-4 h-4 text-secondary" /> Personal Tasks
                   </h3>
                   <Button variant="gradient" size="sm" className="uppercase font-black text-[9px]">+ New Task</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {player.user_task_templates.map((template: any) => (
                     <Card key={template.user_task_template_id} className="p-5 space-y-4 border-l-4 border-l-secondary">
                        <div className="flex items-center justify-between">
                           <h4 className="font-black text-sm uppercase tracking-tight text-foreground">{template.title}</h4>
                           <Badge variant="info" className="text-[9px] uppercase">{template.frequency_type}</Badge>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Recent Progress</p>
                           <div className="flex gap-1">
                              {template.instances.slice(0, 7).map((inst: any) => (
                                <div 
                                  key={inst.user_task_instance_id} 
                                  className={`w-2 h-6 rounded-full ${inst.status.status_name === 'Completed' ? 'bg-secondary' : 'bg-secondary/10'}`}
                                  title={`${new Date(inst.due_date).toLocaleDateString()}: ${inst.status.status_name}`}
                                />
                              ))}
                           </div>
                        </div>
                     </Card>
                   ))}
                   {player.user_task_templates.length === 0 && (
                     <p className="col-span-2 text-center py-20 text-muted-foreground">No personal tasks found</p>
                   )}
                </div>
              </div>
            )}

            {activeTab === "quests" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                      <Award className="w-4 h-4 text-secondary" /> Player Quests
                   </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {player.user_quests.map((uq: any) => (
                     <Card key={uq.user_quest_id} className="p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${uq.quest_status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                           <Award className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-xs font-bold text-foreground truncate">{uq.quest.title}</h4>
                           <p className="text-[10px] text-muted-foreground">Assigned: {new Date(uq.assigned_date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={uq.quest_status === 'Completed' ? 'success' : 'warning'} className="text-[9px] uppercase">
                           {uq.quest_status}
                        </Badge>
                     </Card>
                   ))}
                   {player.user_quests.length === 0 && (
                     <p className="col-span-2 text-center py-20 text-muted-foreground">No quests assigned</p>
                   )}
                </div>
              </div>
            )}

            {activeTab === "squads" && (
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                   <User className="w-4 h-4 text-secondary" /> Squad Memberships
                </h3>
                <Card className="overflow-hidden">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-secondary/5 border-b border-secondary/10">
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Squad Name</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Role</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Joined</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-secondary/5">
                         {player.group_memberships?.map((membership: any) => (
                           <tr key={membership.group_id} className="hover:bg-secondary/5 transition-colors">
                              <td className="px-6 py-4">
                                 <p className="text-sm font-bold text-foreground">{membership.group.group_name}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <Badge variant={membership.role.role_name === 'Owner' ? 'warning' : 'neutral'} className="text-[10px]">
                                    {membership.role.role_name}
                                 </Badge>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="text-xs text-muted-foreground">{new Date(membership.joined_at).toLocaleDateString()}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <Button 
                                    variant="primary" 
                                    size="sm" 
                                    onClick={() => router.push(`/dashboard?view=squads/id=${membership.group_id}`)}
                                 >
                                    View Squad
                                 </Button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </Card>
              </div>
            )}

            {activeTab === "inventory" && (
              <div className="space-y-8">
                 <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                       <Heart className="w-4 h-4 text-secondary" /> Personal Pets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {player.user_pet_details?.map((detail: any) => (
                         <Card key={detail.user_pet_id} className="p-6 relative overflow-hidden group">
                            <div className="relative z-10 flex items-center gap-6">
                               <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                                  <Heart className="w-10 h-10 text-secondary fill-secondary" />
                               </div>
                               <div className="flex-1">
                                  <h4 className="text-lg font-black text-foreground uppercase tracking-tight">{detail.user_pet.name}</h4>
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                                     {detail.user_pet.pet.species.species_name} • LVL {detail.user_pet.current_level}
                                  </p>
                                  <div className="w-full h-1.5 bg-secondary/10 rounded-full overflow-hidden">
                                     <div className="h-full bg-secondary" style={{ width: `${detail.user_pet.health}%` }} />
                                  </div>
                               </div>
                               {detail.user_pet.isEquipped && (
                                 <Badge variant="success" className="absolute top-4 right-4 text-[8px] uppercase">Equipped</Badge>
                               )}
                            </div>
                         </Card>
                       ))}
                       {player.user_pet_details?.length === 0 && (
                         <p className="col-span-2 text-center py-10 text-muted-foreground">No pets owned</p>
                       )}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                       <Box className="w-4 h-4 text-secondary" /> Item Inventory
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                       {player.user_inventory?.map((inv: any) => (
                         <Card key={inv.user_inventory_id} className="p-4 space-y-2">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                               <Box className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                               <h5 className="text-[11px] font-bold text-foreground truncate">{inv.item.item_name}</h5>
                               <p className="text-[10px] text-muted-foreground">Qty: {inv.quantity}</p>
                            </div>
                         </Card>
                       ))}
                       {player.user_inventory?.length === 0 && (
                         <p className="col-span-full text-center py-10 text-muted-foreground">Inventory is empty</p>
                       )}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === "reflections" && (
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                   <Smile className="w-4 h-4 text-secondary" /> Reflection Logs
                </h3>
                <div className="space-y-4">
                   {player.reflections.map((ref: any) => (
                     <Card key={ref.reflection_id} className="p-5">
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-2">
                              <Badge variant="info" className="uppercase text-[9px] px-3 py-1">{ref.mood.mood_label}</Badge>
                              <span className="text-[10px] font-bold text-muted-foreground">{new Date(ref.created_at).toLocaleString()}</span>
                           </div>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed italic border-l-2 border-secondary/20 pl-4 py-1">
                           "{ref.content}"
                        </p>
                     </Card>
                   ))}
                   {player.reflections.length === 0 && (
                     <p className="text-center py-20 text-muted-foreground">No reflections logged yet</p>
                   )}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <Card className="p-6 space-y-8">
                   <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-red-500 flex items-center gap-2 mb-2">
                         <Lock className="w-4 h-4" /> Password Override
                      </h3>
                      <p className="text-[10px] text-muted-foreground mb-6">Force a new password for this user. They will need to use this new password to login immediately.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-4">
                            <PasswordField
                              label="New Password"
                              placeholder="Enter new password..."
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              generateAction={
                                <button onClick={handleGeneratePassword} className="text-[9px] font-black uppercase text-secondary hover:underline">
                                   Generate Strong
                                </button>
                              }
                            />
                            <PasswordField
                              label="Confirm New Password"
                              placeholder="Repeat password..."
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              className={showMatchError ? "border-red-500/50" : ""}
                            />
                            {showMatchError && <p className="text-[9px] font-bold text-red-500 uppercase tracking-tight">Passwords do not match</p>}
                            {passwordsMatch && <p className="text-[9px] font-bold text-secondary uppercase tracking-tight">Passwords match</p>}
                         </div>

                         <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10 space-y-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Requirements</p>
                            <div className="space-y-2">
                               {[
                                 { key: 'length', label: 'At least 8 characters' },
                                 { key: 'uppercase', label: 'One uppercase letter' },
                                 { key: 'lowercase', label: 'One lowercase letter' },
                                 { key: 'number', label: 'One number' },
                                 { key: 'special', label: 'One special character' },
                               ].map((req) => (
                                 <div key={req.key} className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded flex items-center justify-center ${passwordValidation[req.key as keyof typeof passwordValidation] ? 'bg-secondary text-white' : 'bg-secondary/10 text-muted-foreground/20'}`}>
                                       <Check className="w-2.5 h-2.5" />
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase ${passwordValidation[req.key as keyof typeof passwordValidation] ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                                       {req.label}
                                    </span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                         <Button 
                          variant="gradient" 
                          size="sm" 
                          disabled={!passwordsMatch || !Object.values(passwordValidation).every(Boolean)}
                          onClick={handleUpdate}
                          loading={updating}
                          className="font-black uppercase tracking-widest text-[10px]"
                         >
                            Update Password
                         </Button>
                      </div>
                   </div>

                   <div className="pt-8 border-t border-secondary/10">
                      <h3 className="text-sm font-black uppercase tracking-widest text-red-500 flex items-center gap-2 mb-2">
                         <Ban className="w-4 h-4" /> Account Status
                      </h3>
                      <p className="text-[10px] text-muted-foreground mb-6">Suspend or reactivate this player's account. Suspended players cannot log in.</p>
                      
                      <div className="flex items-center gap-4">
                         {player.account_status_id === 1 ? (
                           <Button 
                            variant="primary" 
                            size="md" 
                            className="text-red-500 border-red-500/20 hover:bg-red-500/10 font-black uppercase"
                            onClick={() => setIsConfirmOpen(true)}
                           >
                              Suspend Account
                           </Button>
                         ) : (
                           <Button 
                            variant="gradient" 
                            size="md" 
                            className="font-black uppercase"
                            onClick={() => {
                              setUpdating(true);
                              apiFetch(`/admin/users/${id}/status`, {
                                method: "PATCH",
                                body: JSON.stringify({ status_id: 1 })
                              }).then(() => {
                                toast.success("Account reactivated");
                                loadPlayerDetails();
                              }).finally(() => setUpdating(false));
                            }}
                           >
                              Reactivate Account
                           </Button>
                         )}
                      </div>
                   </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSuspend}
        title="Suspend Account"
        description={`Are you sure you want to suspend ${player.username}'s account? They will lose access to the platform immediately.`}
        confirmLabel="Yes, Suspend"
        variant="danger"
        loading={updating}
      />
    </div>
  );
}
