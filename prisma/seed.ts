import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);

  const users = [
    {
      email: 'customer@zippygo.com',
      phone: '9999999991',
      name: 'John Customer',
      role: UserRole.CUSTOMER,
      passwordHash,
      emailVerified: true,
    },
    {
      email: 'restaurant@zippygo.com',
      phone: '9999999992',
      name: 'Mike Restaurant',
      role: UserRole.RESTAURANT_OWNER,
      passwordHash,
      emailVerified: true,
    },
    {
      email: 'rider@zippygo.com',
      phone: '9999999993',
      name: 'Sam Rider',
      role: UserRole.DELIVERY_PARTNER,
      passwordHash,
      emailVerified: true,
    },
    {
      email: 'admin@zippygo.com',
      phone: '9999999994',
      name: 'Admin User',
      role: UserRole.MALL_ADMIN,
      passwordHash,
      emailVerified: true,
    },
    {
      email: 'superadmin@zippygo.com',
      phone: '9999999995',
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      passwordHash,
      emailVerified: true,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(`Created user: ${user.email} (${user.role})`);
  }

  console.log('\n--- Login Credentials ---');
  console.log('Password for all: password123');
  console.log('customer@zippygo.com - Customer');
  console.log('restaurant@zippygo.com - Restaurant Owner');
  console.log('rider@zippygo.com - Delivery Partner');
  console.log('admin@zippygo.com - Mall Admin');
  console.log('superadmin@zippygo.com - Super Admin');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
