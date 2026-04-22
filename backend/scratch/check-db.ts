import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const admins = await prisma.account.findMany({
    where: { type: { type_name: 'Admin' } },
    include: { type: true }
  });
  console.log('Admin Accounts:', JSON.stringify(admins, null, 2));
}

main().finally(() => prisma.$disconnect());
