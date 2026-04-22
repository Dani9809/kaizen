"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft,
  Users,
  Target,
  Zap,
  Shield,
  Calendar,
  Box,
  Layout,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Heart,
  Star,
  Award,
  Edit2,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { fetchGroupDetails } from "../api/groups";
import { GroupDetails as IGroupDetails } from "../types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BackButton } from "@/components/ui/BackButton";
import { apiFetch } from "@/lib/api";
import MemberModal from "./MemberModal";

interface GroupDetailsProps {
  id: string | number;
}

export default function GroupDetails({ id }: GroupDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [group, setGroup] = useState<IGroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const loadGroupDetails = useCallback(async () => {
    try {
      const data = await fetchGroupDetails(id);
      setGroup(data);
    } catch (err) {
      toast.error("Failed to fetch squad details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm("Are you sure you want to remove this member from the squad?")) return;
    try {
      await apiFetch(`/admin/groups/members/${memberId}`, { method: "DELETE" });
      toast.success("Member removed from squad");
      loadGroupDetails();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove member");
    }
  };

  const openAddMember = () => {
    setSelectedMember(null);
    setIsMemberModalOpen(true);
  };

  const openEditMember = (member: any) => {
    setSelectedMember(member);
    setIsMemberModalOpen(true);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Layout },
    { id: "members", label: "Members", icon: Users },
    { id: "tasks", label: "Tasks", icon: Target },
    { id: "quests", label: "Quests", icon: Award },
    { id: "pet", label: "Pet", icon: Heart },
    { id: "inventory", label: "Inventory", icon: Box },
  ];

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/dashboard?view=squads/id=${id}&tab=${tabId}`, { scroll: false });
  };

  const goBack = () => {
    router.push(`/dashboard?view=squads`);
  };

  useEffect(() => {
    loadGroupDetails();
  }, [loadGroupDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
        <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-bold">Squad not found</p>
        <Button variant="primary" onClick={goBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <BackButton href="/dashboard?view=squads" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-foreground font-heading uppercase tracking-tight">
                {group.group_name}
              </h1>
              <Badge variant={group.isSharable ? "success" : "neutral"}>
                {group.isSharable ? "Public" : "Private"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3 h-3" /> Created on {new Date(group.group_created).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="gradient" size="sm" className="font-bold text-[10px] uppercase">Edit Squad</Button>
          <Button variant="danger" size="sm" className="font-bold text-[10px] uppercase">Disband</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-secondary/5 rounded-2xl w-fit border border-secondary/10 overflow-x-auto custom-scrollbar no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap
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

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Current Streak</p>
                  <h3 className="text-3xl font-black text-foreground font-heading flex items-center gap-2">
                    <Zap className="w-6 h-6 text-amber-500 fill-amber-500" /> {group.group_streak}
                  </h3>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Members</p>
                  <h3 className="text-3xl font-black text-foreground font-heading flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-500" /> {group.members.length}
                  </h3>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Longest Streak</p>
                  <h3 className="text-3xl font-black text-foreground font-heading flex items-center gap-2">
                    <Star className="w-6 h-6 text-indigo-500 fill-indigo-500" /> {group.longest_streak}
                  </h3>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-indigo-500" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Last Freeze</p>
                  <h3 className="text-sm font-black text-foreground font-heading flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-500" /> 
                    {group.last_freeze_used_date 
                      ? new Date(group.last_freeze_used_date).toLocaleDateString() 
                      : "NEVER USED"}
                  </h3>
                </div>
                <div className="p-3 bg-sky-500/10 rounded-2xl">
                  <Shield className="w-6 h-6 text-sky-500" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "members" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-secondary" /> Squad Roster
              </h3>
              <Button 
                variant="gradient" 
                size="sm" 
                className="text-[10px] uppercase font-black px-4"
                onClick={() => setIsMemberModalOpen(true)}
              >
                <Users className="w-3.5 h-3.5 mr-2" /> Manage Roster
              </Button>
            </div>
            <Card className="overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary/5 border-b border-secondary/10">
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Player</th>
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Joined At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/5">
                  {group.members.map((member) => (
                    <tr key={member.group_member_id} className="hover:bg-secondary/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary font-black text-xs uppercase">
                            {member.account.username[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{member.account.username}</p>
                            <p className="text-[10px] text-muted-foreground">{member.account.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={member.role.role_name === 'Owner' || member.role.role_name === 'Leader' ? 'warning' : 'neutral'} className="text-[10px]">
                          {member.role.role_name}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-muted-foreground">{new Date(member.joined_at).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

      {/* Member Management Modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSuccess={loadGroupDetails}
        groupId={Number(id)}
      />

        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-secondary" /> Group Tasks
              </h3>
              <Button variant="gradient" size="sm" className="text-[10px] uppercase font-black">+ New Task</Button>
            </div>
            <div className="space-y-8">
              {group.task_templates.map((template) => (
                <div key={template.group_task_template_id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Target className="w-4 h-4 text-secondary" /> {template.title}
                      <Badge variant="neutral" className="text-[9px] uppercase">{template.frequency_type}</Badge>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {template.instances.map((instance) => (
                      <Card key={instance.group_task_instance_id} className="p-4 border-l-4 border-l-secondary">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" /> {new Date(instance.due_date).toLocaleDateString()}
                          </div>
                          <Badge 
                            variant={instance.status.status_name === 'Completed' ? 'success' : 'warning'}
                            className="text-[10px]"
                          >
                            {instance.status.status_name}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Member Status</p>
                          <div className="flex flex-wrap gap-1.5">
                            {instance.member_logs.map((log, idx) => (
                              <div 
                                key={idx} 
                                className="flex items-center gap-1 px-2 py-1 bg-secondary/5 rounded-lg border border-secondary/10"
                                title={`${log.account.username}: ${log.status.status_name}`}
                              >
                                {log.status.status_name === 'Completed' 
                                  ? <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                  : <XCircle className="w-3 h-3 text-amber-500" />}
                                <span className="text-[9px] font-bold">{log.account.username}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
              {group.task_templates.length === 0 && (
                <div className="py-20 text-center text-muted-foreground">No task templates found</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "quests" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                <Award className="w-4 h-4 text-secondary" /> Active Quests
              </h3>
              <Button variant="gradient" size="sm" className="text-[10px] uppercase font-black">+ Assign Quest</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.quest_instances.map((instance) => (
                <Card key={instance.group_quest_instance_id} className="p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-foreground uppercase tracking-tight">{instance.quest.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Assigned: {new Date(instance.assigned_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs font-black text-amber-600 flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-amber-600" /> {instance.quest.reward_amount} Reward
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
                    <div className="flex -space-x-2">
                      {instance.member_logs.map((log, idx) => (
                        <div 
                          key={idx}
                          className={`w-8 h-8 rounded-full border-2 border-white dark:border-card flex items-center justify-center text-[10px] font-black uppercase
                            ${log.quest_status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-secondary/20 text-muted-foreground'}`}
                          title={`${log.account.username}: ${log.quest_status}`}
                        >
                          {log.account.username[0]}
                        </div>
                      ))}
                    </div>
                    <Badge variant={instance.quest_status === 'Completed' ? 'success' : 'neutral'}>
                      {instance.quest_status}
                    </Badge>
                  </div>
                </Card>
              ))}
              {group.quest_instances.length === 0 && (
                <div className="py-20 text-center text-muted-foreground md:col-span-2">No quest instances found</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "pet" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {group.pet_details.map((detail, idx) => (
              <Card key={idx} className="p-8 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-secondary/20 to-secondary/40 rounded-full flex items-center justify-center mb-6 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                     <Heart className="w-16 h-16 text-secondary fill-secondary animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground font-heading uppercase tracking-tight mb-1">{detail.group_pet.name}</h3>
                  <Badge variant="info" className="mb-6 uppercase tracking-widest text-[10px] py-1 px-4">{detail.group_pet.pet.species.species_name}</Badge>
                  
                  <div className="grid grid-cols-2 gap-8 w-full">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Level</p>
                      <p className="text-xl font-black text-foreground">{detail.group_pet.current_level}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Health</p>
                      <p className="text-xl font-black text-foreground">{detail.group_pet.health}%</p>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-secondary/10 rounded-full mt-6 overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full" 
                      style={{ width: `${detail.group_pet.health}%` }}
                    />
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant={detail.group_pet.isEquipped ? "success" : "neutral"} className="uppercase font-black text-[9px]">
                    {detail.group_pet.isEquipped ? "Equipped" : "Unequipped"}
                  </Badge>
                </div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
              </Card>
            ))}
            {group.pet_details.length === 0 && (
              <div className="py-20 text-center text-muted-foreground md:col-span-2">No group pet found</div>
            )}
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.inventory.map((inv) => (
              <Card key={inv.group_inventory_id} className="p-4 flex gap-4 items-center">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Box className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground">{inv.item.item_name}</h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{inv.item.item_description}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Qty</p>
                  <p className="text-sm font-black text-secondary">{inv.quantity}</p>
                </div>
              </Card>
            ))}
            {group.inventory.length === 0 && (
              <div className="py-20 text-center text-muted-foreground sm:col-span-2 lg:col-span-3">Inventory is empty</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
