import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log('Start seeding...');

  // 1. Account Statuses
  const accountStatuses = ['Active', 'Suspended', 'Banned'];
  for (const status of accountStatuses) {
    await prisma.accountStatus.upsert({
      where: { account_status_name: status },
      update: {},
      create: { account_status_name: status },
    });
  }
  console.log('Seeded AccountStatuses');

  // 2. Subscription Tiers
  await prisma.subscriptionTier.upsert({
    where: { subscription_tier_name: 'Free' },
    update: {},
    create: {
      subscription_tier_name: 'Free',
      monthly_price: 0.0,
      max_active_groups: 3,
      max_custom_tasks: 10,
    },
  });
  await prisma.subscriptionTier.upsert({
    where: { subscription_tier_name: 'Pro' },
    update: {},
    create: {
      subscription_tier_name: 'Pro',
      monthly_price: 4.99,
      max_active_groups: 10,
      max_custom_tasks: 50,
    },
  });
  console.log('Seeded SubscriptionTiers');

  // 3. Roles
  const roles = ['Owner', 'Admin', 'Member'];
  for (const role of roles) {
    await prisma.role.upsert({
      where: { role_name: role },
      update: {},
      create: { role_name: role },
    });
  }
  console.log('Seeded Roles');

  // 4. Task Statuses
  const taskStatuses = [
    { name: 'Pending', desc: 'Task is waiting to be completed.' },
    { name: 'Completed', desc: 'Task has been completed successfully.' },
    { name: 'Failed', desc: 'Task was not completed in time.' },
    { name: 'Frozen', desc: 'Task was frozen using a Streak Freeze.' },
  ];
  for (const status of taskStatuses) {
    await prisma.taskStatus.upsert({
      where: { status_name: status.name },
      update: { status_description: status.desc },
      create: { status_name: status.name, status_description: status.desc },
    });
  }
  console.log('Seeded TaskStatuses');

  // 5. Quest Types
  const questTypes = [
    { name: 'Solo', desc: 'A quest meant to be completed by a single individual.' },
    { name: 'Group', desc: 'A quest requiring effort from the whole group.' },
  ];
  for (const q of questTypes) {
    await prisma.questType.upsert({
      where: { quest_type_name: q.name },
      update: { quest_type_description: q.desc },
      create: { quest_type_name: q.name, quest_type_description: q.desc },
    });
  }
  console.log('Seeded QuestTypes');

  // 6. Moods
  const moods = [
    { label: 'Happy', desc: 'Feeling joyful and positive.' },
    { label: 'Sad', desc: 'Feeling down or upset.' },
    { label: 'Neutral', desc: 'Feeling okay, nothing too extreme.' },
    { label: 'Angry', desc: 'Feeling frustrated or mad.' },
    { label: 'Productive', desc: 'Feeling energized and ready to work.' },
  ];
  for (const mood of moods) {
    await prisma.mood.upsert({
      where: { mood_label: mood.label },
      update: { mood_description: mood.desc },
      create: { mood_label: mood.label, mood_description: mood.desc },
    });
  }
  console.log('Seeded Moods');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
