import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.dev" },
    update: {},
    create: {
      fullName: "Demo Admin",
      email: "admin@demo.dev",
      role: Role.ADMIN,
      password: null,
    },
  });

  const store = await prisma.store.upsert({
    where: { slug: "demo-store" },
    update: { name: "Demo Store" },
    create: {
      slug: "demo-store",
      name: "Demo Store",
      address: "123 Commerce Street",
      logo: "https://placehold.co/120x120",
      banner: "https://placehold.co/1024x360",
      userId: admin.id,
    },
  });

  const billboard = await prisma.billboard.upsert({
    where: { id: store.id },
    update: {
      label: "Seasonal Sale",
      imageUrl: "https://placehold.co/1024x360",
    },
    create: {
      id: store.id,
      label: "Seasonal Sale",
      imageUrl: "https://placehold.co/1024x360",
      storeId: store.id,
    },
  });

  const size = await prisma.size.upsert({
    where: { id: store.id },
    update: {
      name: "Large",
      value: "L",
    },
    create: {
      id: store.id,
      storeId: store.id,
      name: "Large",
      value: "L",
    },
  });

  const color = await prisma.color.upsert({
    where: { id: store.slug },
    update: {
      name: "Black",
      value: "#000000",
    },
    create: {
      id: store.slug,
      storeId: store.id,
      name: "Black",
      value: "#000000",
    },
  });

  const category = await prisma.category.upsert({
    where: { id: store.slug },
    update: { name: "Apparel" },
    create: {
      id: store.slug,
      storeId: store.id,
      billboardId: billboard.id,
      name: "Apparel",
    },
  });

  let product = await prisma.product.findFirst({
    where: { name: "Demo Tee", storeId: store.id },
  });

  if (!product) {
    product = await prisma.product.create({
      data: {
        name: "Demo Tee",
        description: "Soft cotton tee for demo purposes.",
        price: 29.99,
        storeId: store.id,
        categoryId: category.id,
        sizeId: size.id,
        colorId: color.id,
        images: {
          create: [
            { url: "https://placehold.co/640x640?text=Front" },
            { url: "https://placehold.co/640x640?text=Back" },
          ],
        },
      },
    });
  }

  let cart = await prisma.cart.findFirst({
    where: { storeId: store.id, userId: admin.id },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        storeId: store.id,
        userId: admin.id,
        items: {
          create: {
            productId: product.id,
            quantity: 2,
          },
        },
      },
      include: { items: true },
    });
  }

  if (cart.items.length === 0) {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        quantity: 2,
      },
    });
  }

  const orderExists = await prisma.order.findFirst({
    where: { storeId: store.id },
  });

  if (!orderExists) {
    await prisma.order.create({
      data: {
        storeId: store.id,
        userId: admin.id,
        phone: "+1 555-5555",
        address: "123 Commerce Street",
        isPaid: false,
        orderItems: {
          create: [
            { productId: product.id, quantity: 1 },
            { productId: product.id, quantity: 2 },
          ],
        },
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

