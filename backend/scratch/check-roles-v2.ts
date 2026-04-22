import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const roles = await prisma.role.findMany();
    console.log('Roles in DB:', roles);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error);
