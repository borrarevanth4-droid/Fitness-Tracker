import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const testPassword  = await bcrypt.hash('Test123!', 10);

  console.log('Seeding users...');
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@fitness.app' },
    update: {},
    create: { email: 'admin@fitness.app', name: 'Admin', passwordHash: adminPassword, role: 'ADMIN' },
  });

  const alice = await prisma.user.upsert({
    where:  { email: 'alice@fitness.app' },
    update: {},
    create: { email: 'alice@fitness.app', name: 'Alice', passwordHash: testPassword },
  });

  console.log('Seeding Alice health profile...');
  await prisma.healthProfile.upsert({
    where:  { userId: alice.id },
    update: {},
    create: {
      userId:         alice.id,
      goal:           'Fat Loss',
      dietPreference: 'Vegetarian',
      equipment:      'None (Bodyweight)',
      weightKg:       68.0,
      heightCm:       162.0,
      age:            27,
      gender:         'Female',
    },
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
