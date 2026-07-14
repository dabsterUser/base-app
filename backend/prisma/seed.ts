import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Bootstrapping system roles and permissions...');

  // 1. Roles
  const roles = [
    { name: 'super admin', description: 'Full system access' },
    { name: 'admin', description: 'Administrative access' },
    { name: 'user', description: 'Standard user access' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // 2. Basic Permissions
  const permissions = [
    { name: 'users.view', module: 'users', action: 'view' },
    { name: 'users.create', module: 'users', action: 'create' },
    { name: 'users.edit', module: 'users', action: 'edit' },
    { name: 'users.delete', module: 'users', action: 'delete' },
    { name: 'settings.view', module: 'settings', action: 'view' },
    { name: 'settings.edit', module: 'settings', action: 'edit' },
    { name: 'forms.view', module: 'forms', action: 'view' },
    { name: 'forms.create', module: 'forms', action: 'create' },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  console.log('Bootstrap complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
