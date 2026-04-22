export interface Group {
  group_id: number;
  group_name: string;
  group_streak: number;
  last_freeze_used_date: string | null;
  longest_streak: number;
  isSharable: boolean;
  group_created: string;
  group_updated: string;
  _count?: {
    members: number;
  };
}

export interface GroupMember {
  group_member_id: number;
  group_id: number;
  account_id: number;
  joined_at: string;
  account: {
    account_id: number;
    username: string;
    email: string;
  };
  role: {
    role_id: number;
    role_name: string;
  };
}

export interface GroupTaskInstance {
  group_task_instance_id: number;
  due_date: string;
  group_completed_at: string | null;
  status: {
    status_name: string;
  };
  member_logs: Array<{
    account: { username: string };
    status: { status_name: string };
    completed_at: string | null;
  }>;
}

export interface GroupTaskTemplate {
  group_task_template_id: number;
  title: string;
  frequency_type: string;
  requires_all_members: boolean;
  schedules: Array<{ day_of_week: number }>;
  instances: GroupTaskInstance[];
}

export interface GroupQuestInstance {
  group_quest_instance_id: number;
  assigned_date: string;
  quest_status: string;
  quest: {
    title: string;
    reward_amount: number;
  };
  member_logs: Array<{
    account: { username: string };
    quest_status: string;
    completed_at: string | null;
  }>;
}

export interface GroupPet {
  group_pet_id: number;
  name: string;
  current_level: number;
  health: number;
  isEquipped: boolean;
  pet: {
    pet_name: string;
    species: {
      species_name: string;
      category: { species_category_name: string };
      level: { species_level_name: string };
    };
  };
}

export interface GroupInventoryItem {
  group_inventory_id: number;
  quantity: number;
  item: {
    item_name: string;
    item_description: string;
    item_price: number;
  };
}

export interface GroupDetails extends Group {
  members: GroupMember[];
  task_templates: GroupTaskTemplate[];
  quest_instances: GroupQuestInstance[];
  pet_details: Array<{ group_pet: GroupPet }>;
  inventory: GroupInventoryItem[];
}
