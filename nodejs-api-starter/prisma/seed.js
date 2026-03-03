const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@example.com', password: adminPassword, role: 'ADMIN' },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: { name: 'Regular User', email: 'user@example.com', password: userPassword, role: 'USER' },
  });

  await prisma.job.createMany({
    data: [
      {
        title: 'Senior Software Engineer',
        description: 'Build scalable backend services using Node.js and PostgreSQL.',
        location: 'Brisbane',
        salary: '$120,000 - $150,000',
        type: 'FULL_TIME',
        status: 'OPEN',
        postedById: admin.id,
      },
      {
        title: 'Frontend Developer',
        description: 'Create beautiful UIs with React and Tailwind CSS.',
        location: 'Sydney',
        salary: '$90,000 - $110,000',
        type: 'FULL_TIME',
        status: 'OPEN',
        postedById: user.id,
      },
      {
        title: 'DevOps Engineer',
        description: 'Manage CI/CD pipelines and cloud infrastructure.',
        location: 'Melbourne',
        salary: '$130,000 - $160,000',
        type: 'CONTRACT',
        status: 'OPEN',
        postedById: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed complete!');
  console.log('Admin: admin@example.com / Admin123!');
  console.log('User:  user@example.com  / User123!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
