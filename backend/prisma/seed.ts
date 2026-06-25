import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.aIConversation.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.review.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.order.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.addon.deleteMany(),
    prisma.variant.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.table.deleteMany(),
    prisma.loginHistory.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.organizationSetting.deleteMany(),
    prisma.restaurant.deleteMany(),
    prisma.user.deleteMany(),
    prisma.organization.deleteMany(),
  ]);

  // Create password
  const password = await bcrypt.hash("password123", 12);

  // Create Organization
  const org = await prisma.organization.create({
    data: {
      name: "City Food Court Mall",
      slug: "city-food-court",
      address: "123 Main Street, Downtown",
      phone: "+1-555-0100",
      email: "admin@cityfoodcourt.com",
    },
  });

  // Create Users
  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@foodcourtos.com",
      password,
      role: "SUPER_ADMIN" as Role,
      isActive: true,
    },
  });

  const mallAdmin = await prisma.user.create({
    data: {
      name: "Mall Admin",
      email: "malladmin@cityfoodcourt.com",
      password,
      role: "MALL_ADMIN" as Role,
      isActive: true,
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "Pizza Paradise Owner",
      email: "owner@pizzaparadise.com",
      password,
      role: "RESTAURANT_OWNER" as Role,
      isActive: true,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Restaurant Manager",
      email: "manager@pizzaparadise.com",
      password,
      role: "RESTAURANT_MANAGER" as Role,
      isActive: true,
    },
  });

  const chef = await prisma.user.create({
    data: {
      name: "Kitchen Staff",
      email: "kitchen@pizzaparadise.com",
      password,
      role: "KITCHEN_STAFF" as Role,
      isActive: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "customer@example.com",
      password,
      role: "CUSTOMER" as Role,
      phone: "+1-555-1234",
      isActive: true,
    },
  });

  // Create Subscription
  await prisma.subscription.create({
    data: {
      organizationId: org.id,
      plan: "enterprise",
      status: "active",
      maxRestaurants: 50,
      maxStaff: 200,
    },
  });

  // Create Restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      organizationId: org.id,
      ownerId: owner.id,
      name: "Pizza Paradise",
      slug: "pizza-paradise",
      description: "Authentic Italian pizzas made with fresh ingredients and traditional recipes.",
      cuisine: "Italian, Pizza",
      phone: "+1-555-0200",
      email: "hello@pizzaparadise.com",
      address: "Food Court, Level 2, City Mall",
      priceRange: "$$",
      deliveryTime: "25-35",
      rating: 4.5,
      isOpen: true,
      openingTime: "10:00",
      closingTime: "22:00",
    },
  });

  // Assign staff
  await prisma.user.update({
    where: { id: manager.id },
    data: { staffOfId: restaurant.id },
  });
  await prisma.user.update({
    where: { id: chef.id },
    data: { staffOfId: restaurant.id },
  });

  // Create Categories
  const pizzasCat = await prisma.category.create({
    data: { restaurantId: restaurant.id, name: "Pizzas", slug: "pizzas", sortOrder: 1 },
  });
  const pastaCat = await prisma.category.create({
    data: { restaurantId: restaurant.id, name: "Pasta", slug: "pasta", sortOrder: 2 },
  });
  const saladsCat = await prisma.category.create({
    data: { restaurantId: restaurant.id, name: "Salads", slug: "salads", sortOrder: 3 },
  });
  const sidesCat = await prisma.category.create({
    data: { restaurantId: restaurant.id, name: "Sides", slug: "sides", sortOrder: 4 },
  });
  const dessertsCat = await prisma.category.create({
    data: { restaurantId: restaurant.id, name: "Desserts", slug: "desserts", sortOrder: 5 },
  });
  const drinksCat = await prisma.category.create({
    data: { restaurantId: restaurant.id, name: "Beverages", slug: "beverages", sortOrder: 6 },
  });

  // Create Products
  const margherita = await prisma.product.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: pizzasCat.id,
      name: "Margherita Pizza",
      slug: "margherita-pizza",
      description: "Fresh mozzarella, tomato sauce, basil on a wood-fired crust",
      price: 349,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
      isPopular: true,
      preparationTime: 15,
      sortOrder: 1,
    },
  });

  const pepperoni = await prisma.product.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: pizzasCat.id,
      name: "Pepperoni Pizza",
      slug: "pepperoni-pizza",
      description: "Double pepperoni, mozzarella, oregano on a crispy crust",
      price: 449,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
      isPopular: true,
      preparationTime: 15,
      sortOrder: 2,
    },
  });

  await prisma.product.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: pastaCat.id,
      name: "Pasta Carbonara",
      slug: "pasta-carbonara",
      description: "Creamy sauce, pancetta, parmesan cheese",
      price: 399,
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
      preparationTime: 20,
      sortOrder: 1,
    },
  });

  await prisma.product.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: saladsCat.id,
      name: "Caesar Salad",
      slug: "caesar-salad",
      description: "Romaine lettuce, croutons, parmesan, caesar dressing",
      price: 249,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
      preparationTime: 10,
      sortOrder: 1,
    },
  });

  await prisma.product.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: sidesCat.id,
      name: "Garlic Bread",
      slug: "garlic-bread",
      description: "Toasted ciabatta with garlic butter and herbs",
      price: 149,
      image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400",
      isPopular: true,
      preparationTime: 8,
      sortOrder: 1,
    },
  });

  await prisma.product.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: dessertsCat.id,
      name: "Tiramisu",
      slug: "tiramisu",
      description: "Classic Italian coffee-flavored dessert",
      price: 299,
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
      preparationTime: 5,
      sortOrder: 1,
    },
  });

  // Create Variants for Margherita
  await prisma.variant.createMany({
    data: [
      { productId: margherita.id, name: "Small (10\")", price: 0 },
      { productId: margherita.id, name: "Medium (12\")", price: 100 },
      { productId: margherita.id, name: "Large (14\")", price: 200 },
    ],
  });

  // Create Add-ons
  await prisma.addon.createMany({
    data: [
      { productId: margherita.id, name: "Extra Cheese", price: 50, maxSelect: 1 },
      { productId: margherita.id, name: "Mushrooms", price: 40, maxSelect: 1 },
      { productId: margherita.id, name: "Olives", price: 30, maxSelect: 1 },
      { productId: margherita.id, name: "Extra Pepperoni", price: 60, maxSelect: 1 },
    ],
  });

  // Create Tables
  for (let i = 1; i <= 20; i++) {
    await prisma.table.create({
      data: {
        restaurantId: restaurant.id,
        number: i,
        capacity: i <= 4 ? 2 : i <= 12 ? 4 : 6,
        qrCode: `table-${i}-qr`,
      },
    });
  }

  // Create Coupon
  await prisma.coupon.create({
    data: {
      restaurantId: restaurant.id,
      code: "PIZZA20",
      type: "percentage",
      value: 20,
      minOrder: 500,
      maxDiscount: 150,
      maxUses: 100,
      isActive: true,
      expiresAt: new Date("2025-12-31"),
    },
  });

  // Create a sample order
  const order = await prisma.order.create({
    data: {
      orderNumber: "ORD-0001",
      userId: customer.id,
      restaurantId: restaurant.id,
      status: "DELIVERED",
      subtotal: 798,
      deliveryFee: 49,
      packagingFee: 19,
      total: 866,
      tableNumber: 5,
      items: {
        create: [
          {
            productId: margherita.id,
            name: "Margherita Pizza",
            price: 349,
            quantity: 2,
            total: 698,
          },
          {
            productId: pepperoni.id,
            name: "Garlic Bread",
            price: 149,
            quantity: 1,
            total: 149,
          },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: 866,
      status: "PAID",
      method: "razorpay",
      provider: "Razorpay",
      transactionId: "txn_1234567890",
    },
  });

  // Create Review
  await prisma.review.create({
    data: {
      userId: customer.id,
      restaurantId: restaurant.id,
      orderId: order.id,
      rating: 5,
      comment: "Amazing pizza! The crust was perfect and the ingredients were fresh. Highly recommend the Margherita!",
    },
  });

  console.log("✅ Seeding complete!");
  console.log("📧 Login credentials (password: password123):");
  console.log("   superadmin@foodcourtos.com (Super Admin)");
  console.log("   malladmin@cityfoodcourt.com (Mall Admin)");
  console.log("   owner@pizzaparadise.com (Restaurant Owner)");
  console.log("   manager@pizzaparadise.com (Manager)");
  console.log("   kitchen@pizzaparadise.com (Kitchen Staff)");
  console.log("   customer@example.com (Customer)");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
