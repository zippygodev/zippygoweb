import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 12);

  // ── 1. Organization ──────────────────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: 'zippygo-hq' },
    update: {},
    create: {
      name: 'Zippy Go HQ',
      slug: 'zippygo-hq',
      email: 'admin@zippygo.com',
      isActive: true,
    },
  });
  console.log('✅ Organization:', org.name);

  // ── 2. Mall ──────────────────────────────────────────────────────────────────
  const mall = await prisma.mall.upsert({
    where: { slug: 'demo-food-court' },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Demo Food Court',
      slug: 'demo-food-court',
      address: 'Level 2, Demo Mall, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      isActive: true,
    },
  });
  console.log('✅ Mall:', mall.name);

  // ── 3. Seed Tables ────────────────────────────────────────────────────────────
  for (let i = 1; i <= 5; i++) {
    await prisma.table.upsert({
      where: { mallId_tableNumber: { mallId: mall.id, tableNumber: `T${i}` } },
      update: {},
      create: {
        mallId: mall.id,
        tableNumber: `T${i}`,
        capacity: 4,
        status: 'AVAILABLE',
        section: 'Main Hall',
      },
    });
  }
  console.log('✅ Tables: 5 tables created');

  // ── 4. Seed Users ────────────────────────────────────────────────────────────
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

  const createdUsers: Record<string, any> = {};

  for (const user of users) {
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        passwordHash,
        isActive: true,
      },
      create: user,
    });
    createdUsers[user.role] = dbUser;
    console.log(`Created user: ${user.email} (${user.role})`);
  }

  // Set up delivery partner details
  await prisma.deliveryPartner.upsert({
    where: { userId: createdUsers[UserRole.DELIVERY_PARTNER].id },
    update: {},
    create: {
      userId: createdUsers[UserRole.DELIVERY_PARTNER].id,
      isOnline: true,
      isAvailable: true,
      vehicleType: 'Bike',
      isVerified: true,
    },
  });

  // ── 5. Restaurant ─────────────────────────────────────────────────────────────
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'pizza-palace' },
    update: {
      isActive: true,
      isOpen: true,
    },
    create: {
      ownerId: createdUsers[UserRole.RESTAURANT_OWNER].id,
      mallId: mall.id,
      name: 'Pizza Palace',
      slug: 'pizza-palace',
      description: 'Authentic Italian pizzas baked in a wood-fired oven. Fresh ingredients, bold flavors.',
      shortDescription: 'Wood-fired Italian Pizzas',
      cuisineType: 'Italian • Pizza',
      logoUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=400&fit=crop',
      phone: '+91 98765 43210',
      email: 'restaurant@zippygo.com',
      address: 'Food Court, Level 2, Stall 12',
      isActive: true,
      isOpen: true,
      preparationTime: 15,
      deliveryTime: 25,
      rating: 4.8,
      totalReviews: 0,
      minOrderAmount: 199,
      deliveryFee: 0,
      gst: 5,
      openingTime: '10:00',
      closingTime: '23:00',
    },
  });
  console.log('✅ Restaurant:', restaurant.name);

  // ── 6. Category ───────────────────────────────────────────────────────────────
  const category = await prisma.category.upsert({
    where: { restaurantId_name: { restaurantId: restaurant.id, name: 'Pizzas' } },
    update: {},
    create: {
      restaurantId: restaurant.id,
      name: 'Pizzas',
      slug: 'pizzas',
      description: 'Our signature wood-fired pizzas',
      sortOrder: 1,
      isActive: true,
    },
  });
  console.log('✅ Category:', category.name);

  // ── 7. Products (2 sample products only) ──────────────────────────────────────
  const margherita = await prisma.product.upsert({
    where: { id: 'prod-margherita' },
    update: {
      isAvailable: true,
      isFeatured: true,
    },
    create: {
      id: 'prod-margherita',
      restaurantId: restaurant.id,
      categoryId: category.id,
      name: 'Margherita Pizza',
      slug: 'margherita-pizza',
      description: 'Fresh mozzarella, homemade tomato sauce, and fresh basil on our signature thin crust.',
      shortDescription: 'Classic Italian margherita',
      price: 349,
      comparePrice: 399,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop',
      ],
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      isAvailable: true,
      isFeatured: true,
      preparationTime: 12,
      calories: 850,
      sortOrder: 1,
    },
  });

  // Add variants for margherita
  const variantSizes = ['Regular (8")', 'Large (12")', 'Extra Large (14")'];
  const variantPrices = [349, 549, 699];
  for (let i = 0; i < variantSizes.length; i++) {
    await prisma.productVariant.upsert({
      where: { id: `margherita-variant-${i}` },
      update: {
        price: variantPrices[i],
      },
      create: {
        id: `margherita-variant-${i}`,
        productId: margherita.id,
        name: variantSizes[i],
        price: variantPrices[i],
        isDefault: i === 0,
        sortOrder: i,
      },
    });
  }
  console.log('✅ Product 1:', margherita.name);

  const pepperoni = await prisma.product.upsert({
    where: { id: 'prod-pepperoni' },
    update: {
      isAvailable: true,
      isFeatured: true,
    },
    create: {
      id: 'prod-pepperoni',
      restaurantId: restaurant.id,
      categoryId: category.id,
      name: 'Pepperoni Pizza',
      slug: 'pepperoni-pizza',
      description: 'Loaded with premium pepperoni slices, mozzarella, and our signature red sauce.',
      shortDescription: 'Classic American pepperoni',
      price: 449,
      comparePrice: 499,
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop',
      ],
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      isAvailable: true,
      isFeatured: true,
      preparationTime: 15,
      calories: 1050,
      sortOrder: 2,
    },
  });

  // Add variants for pepperoni
  const pepVariantSizes = ['Regular (8")', 'Large (12")', 'Extra Large (14")'];
  const pepVariantPrices = [449, 649, 799];
  for (let i = 0; i < pepVariantSizes.length; i++) {
    await prisma.productVariant.upsert({
      where: { id: `pepperoni-variant-${i}` },
      update: {
        price: pepVariantPrices[i],
      },
      create: {
        id: `pepperoni-variant-${i}`,
        productId: pepperoni.id,
        name: pepVariantSizes[i],
        price: pepVariantPrices[i],
        isDefault: i === 0,
        sortOrder: i,
      },
    });
  }
  console.log('✅ Product 2:', pepperoni.name);

  // ── 8. Welcome Notification for customer ────────────────────────────────────
  const existingNotif = await prisma.notification.findFirst({
    where: { userId: createdUsers[UserRole.CUSTOMER].id, type: 'SYSTEM' },
  });
  if (!existingNotif) {
    await prisma.notification.create({
      data: {
        userId: createdUsers[UserRole.CUSTOMER].id,
        title: 'Welcome to Zippy Go! 🎉',
        message: 'Your account is set up and ready. Browse restaurants and place your first order!',
        type: 'SYSTEM',
        isRead: false,
      },
    });
    console.log('✅ Welcome notification created');
  }

  console.log('\n🎉 Seed complete!\n');
  console.log('Test Accounts:');
  console.log('─────────────────────────────────────────────────────');
  console.log('Customer:          customer@zippygo.com   / password123');
  console.log('Restaurant Owner:  restaurant@zippygo.com / password123');
  console.log('Delivery Partner:  rider@zippygo.com      / password123');
  console.log('Mall Admin:        admin@zippygo.com      / password123');
  console.log('Super Admin:       superadmin@zippygo.com / password123');
  console.log('─────────────────────────────────────────────────────');
  console.log('Restaurant slug:   pizza-palace');
  console.log('Products:          Margherita Pizza (₹349), Pepperoni Pizza (₹449)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
