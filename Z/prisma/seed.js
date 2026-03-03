const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('Admin123!', 12),
      role: 'ADMIN',
    },
  });

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@example.com',
      password: await bcrypt.hash('User123!', 12),
      role: 'USER',
    },
  });

  // Create sample jobs
  await prisma.job.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Senior Software Engineer',
        description: 'We are looking for an experienced software engineer to join our team.',
        company: 'Tech Corp',
        location: 'Brisbane, QLD',
        salary: 130000,
        type: 'FULL_TIME',
        status: 'OPEN',
        userId: admin.id,
      },
      {
        title: 'Warehouse Packer',
        description: 'Entry-level warehouse packing and sorting role. No experience needed.',
        company: 'Logistics Plus',
        location: 'Brisbane, QLD',
        salary: 55000,
        type: 'CASUAL',
        status: 'OPEN',
        userId: user.id,
      },
      {
        title: 'Tech Support Engineer',
        description: 'Provide technical support to customers via phone and email.',
        company: 'Support Solutions',
        location: 'Remote',
        salary: 90000,
        type: 'FULL_TIME',
        status: 'OPEN',
        userId: user.id,
      },
    ],
  });

  console.log('✅ Seed complete!');
  console.log('👤 Admin:  admin@example.com / Admin123!');
  console.log('👤 User:   user@example.com / User123!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
