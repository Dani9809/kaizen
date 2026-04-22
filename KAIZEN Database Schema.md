## Database Schema of KAIZEN

**Legend:**
* **PK:** Primary Key
* **FK:** Foreign Key
* **UQ:** Unique Key
* **AI:** Auto Increment
* **UN:** Unsigned
* **AN:** Allow Null (Nullable)

#### 1. Core & Account Tables

**Table: `ACCOUNT_STATUS`**
* `account_status_id` (INT, PK)
* `account_status_name` (VARCHAR)

**Table: `SUBSCRIPTION_TIER`**
* `subscription_tier_id`(INT, PK)
* `subscription_tier_name`(VARCHAR)
* `monthly_price`(NUMERIC(13, 2))
* `max_active_groups`(INT)
* `max_custom_tasks`(INT)

**Table: `ACCOUNT`**
* `account_id` (INT, PK)
* `account_status_id` (INT, FK -> `ACCOUNT_STATUS.account_status_id`)
* `subscription_tier_id` (INT, FK -> `SUBSCRIPTION_TIER.subscription_tier_id`)
* `username` (VARCHAR, UQ)
* `email` (VARCHAR, UQ)
* `password` (VARCHAR)
* `currency_balance` (NUMERIC(13, 2))
* `current_streak` (INT)
* `last_freeze_used_date` (DATE, AN)
* `longest_streak` (INT)
* `account_created` (TIMESTAMP)
* `account_updated` (TIMESTAMP)

**Table: `ROLE`**
* `role_id` (INT, PK)
* `role_name` (VARCHAR)

#### 2. Group & Social Tables

**Table: `GROUP`**
* `group_id` (INT, PK)
* `group_name` (VARCHAR)
* `group_streak` (INT)
* `last_freeze_used_date` (DATE, AN)
* `longest_streak` (INT)
* `isSharable` (BOOL)
* `group_created` (TIMESTAMP)

**Table: `GROUP_MEMBER`**
* `group_member_id` (INT, PK)
* `group_id` (INT, FK -> `GROUP.group_id`)
* `account_id` (INT, FK -> `ACCOUNT.account_id`)
* `role_id` (INT, FK -> `ROLE.role_id`)
* `joined_at` (TIMESTAMP)

**Table: `NUDGE`**
* `nudge_id` (INT, PK)
* `account_sender_id` (INT, FK -> `ACCOUNT.account_id`)
* `account_receiver_id` (INT, FK -> `ACCOUNT.account_id`)
* `message` (TEXT)
* `created_at` (TIMESTAMP)

#### 3. Reflections & Mood

**Table: `MOOD`**
* `mood_id` (INT, PK)
* `mood_label` (VARCHAR)
* `mood_description` (TEXT)

**Table: `REFLECTION`**
* `reflection_id` (INT, PK)
* `mood_id` (INT, FK -> `MOOD.mood_id`)
* `account_id` (INT, FK -> `ACCOUNT.account_id`)
* `content` (TEXT)
* `created_at` (TIMESTAMP)

#### 4. Quests

**Table: `QUEST_TYPE`**
* `quest_type_id` (INT, PK)
* `quest_type_name` (VARCHAR)
* `quest_type_description` (TEXT)

**Table: `QUEST`**
* `quest_id` (INT, PK)
* `quest_type_id` (INT, AN, FK -> `QUEST_TYPE.quest_type_id`)
* `title` (VARCHAR)
* `description` (TEXT)
* `reward_amount` (INT)

**Table: `GROUP_QUEST_INSTANCE`**
* `group_quest_instance_id` (INT, PK)
* `quest_id` (INT, FK -> `QUEST.quest_id`)
* `group_id` (INT, FK -> `GROUP.group_id`)
* `assigned_date` (DATE)
* `quest_status` (VARCHAR)

**Table: `GROUP_QUEST_MEMBER_LOG`**
* `group_quest_member_log_id` (INT, PK)
* `group_quest_instance_id` (INT, FK -> `GROUP_QUEST_INSTANCE.group_quest_instance_id`)
* `account_id` (INT, FK -> `ACCOUNT.account_id`)
* `quest_status` (VARCHAR)
* `completed_at` (TIMESTAMP)

**Table: `USER_QUEST`**
* `user_quest_id` (INT, PK)
* `quest_id` (INT, FK -> `QUEST.quest_id`)
* `account_id` (INT, FK -> `ACCOUNT.account_id`)
* `assigned_date` (DATE)
* `quest_status` (VARCHAR)

#### 5. Tasks & Scheduling

**Table: `TASK_STATUS`**
* `task_status_id` (INT, PK)
* `status_name` (VARCHAR)
* `status_description` (TEXT)

**Table: `GROUP_TASK_TEMPLATE`**
* `group_task_template_id` (INT, PK)
* `group_id` (INT, FK -> `GROUP.group_id`)
* `title` (VARCHAR)
* `frequency_type` (VARCHAR)
* `requires_all_members` (BOOL)

**Table: `GROUP_TASK_SCHEDULE`**
* `group_task_schedule_id` (INT, PK)
* `group_task_template_id` (INT, FK -> `GROUP_TASK_TEMPLATE.group_task_template_id`)
* `day_of_week` (INT)

**Table: `GROUP_TASK_INSTANCE`**
* `group_task_instance_id` (INT, PK)
* `group_task_template_id` (INT, FK -> `GROUP_TASK_TEMPLATE.group_task_template_id`)
* `task_status_id` (INT, FK -> `TASK_STATUS.task_status_id`)
* `due_date` (DATE)
* `group_completed_at` (TIMESTAMP)

**Table: `GROUP_TASK_MEMBER_LOG`**
* `group_task_member_log_id` (INT, PK)
* `group_task_instance_id` (INT, FK -> `GROUP_TASK_INSTANCE.group_task_instance_id`)
* `task_status_id` (INT, FK -> `TASK_STATUS.task_status_id`)
* `account_id` (INT, FK -> `ACCOUNT.account_id`)
* `completed_at` (TIMESTAMP)

**Table: `USER_TASK_TEMPLATE`**
* `user_task_template_id` (INT, PK)
* `account_id` (INT, FK -> `ACCOUNT.account_id`)
* `title` (VARCHAR)
* `frequency_type` (VARCHAR)

**Table: `USER_TASK_SCHEDULE`**
* `user_task_schedule_id` (INT, PK)
* `user_task_template_id` (INT, FK -> `USER_TASK_TEMPLATE.user_task_template_id`)
* `day_of_week` (INT)

**Table: `USER_TASK_INSTANCE`**
* `user_task_instance_id` (INT, PK)
* `user_task_template_id` (INT, FK -> `USER_TASK_TEMPLATE.user_task_template_id`)
* `task_status_id` (INT, FK -> `TASK_STATUS.task_status_id`)
* `due_date` (DATE)
* `completed_at` (TIMESTAMP)

#### 6. Shop & Inventory

**Table: `SHOP_ITEM_TYPE`**
* `shop_item_type_id` (INT, PK)
* `item_type_name` (VARCHAR)
* `item_type_description` (TEXT)

**Table: `SHOP_ITEM`**
* `shop_item_id` (INT, PK)
* `shop_item_type_id` (INT, FK -> `SHOP_ITEM_TYPE.shop_item_type_id`)
* `item_name` (VARCHAR)
* `item_description` (TEXT)
* `item_price` (INT)

**Table: `GROUP_INVENTORY`**
* `group_inventory_id` (INT, PK)
* `group_id` (INT, FK -> `GROUP.group_id`)
* `shop_item_id` (INT, FK -> `SHOP_ITEM.shop_item_id`)
* `quantity` (INT)

**Table: `USER_INVENTORY`**
* `user_inventory_id` (INT, PK)
* `account_id` (INT, FK -> `ACCOUNT.account_id`)
* `shop_item_id` (INT, FK -> `SHOP_ITEM.shop_item_id`)
* `quantity` (INT)

#### 7. Pet System

**Table: `SPECIES_CATEGORY`**
* `species_category_id` (INT, PK)
* `species_category_name` (VARCHAR)
* `species_category_description` (TEXT)

**Table: `SPECIES_LEVEL`**
* `species_level_id` (INT, PK)
* `species_level_name` (VARCHAR)
* `species_level_description` (TEXT)

**Table: `SPECIES`**
* `species_id` (INT, PK)
* `species_category_id` (INT, FK -> `SPECIES_CATEGORY.species_category_id`)
* `species_level_id` (INT, FK -> `SPECIES_LEVEL.species_level_id`)
* `species_name` (VARCHAR)
* `species_max_level` (INT)

**Table: `PET`**
* `pet_id` (INT, PK)
* `species_id` (INT, FK -> `SPECIES.species_id`)
* `pet_name` (VARCHAR)
* `pet_description` (TEXT)
* `isForSale` (BOOL)
* `pet_price` (NUMERIC(13, 2))

**Table: `GROUP_PET`**
* `group_pet_id` (INT, PK)
* `pet_id` (INT, FK -> `PET.pet_id`)
* `name` (VARCHAR)
* `current_level` (INT)
* `health` (INT)
* `isEquipped` (BOOL)
* `last_equipped_at` (TIMESTAMP)
* `owned_at` (TIMESTAMP)

**Table: `GROUP_PET_DETAIL`**
* `group_pet_detail_id` (INT, PK)
* `group_pet_id` (INT, FK -> `GROUP_PET.group_pet_id`)
* `group_id` (INT, FK -> `GROUP.group_id`)

**Table: `USER_PET`**
* `user_pet_id` (INT, PK)
* `pet_id` (INT, FK -> `PET.pet_id`)
* `name` (VARCHAR)
* `current_level` (INT)
* `health` (INT)
* `isEquipped` (BOOL)
* `last_equipped_at` (TIMESTAMP)
* `owned_at` (TIMESTAMP)

**Table: `USER_PET_DETAIL`**
* `user_pet_detail_id` (INT, PK)
* `user_pet_id` (INT, FK -> `USER_PET.user_pet_id`)
* `account_id` (INT, FK -> `ACCOUNT.account_id`)