import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { products } from "../src/lib/products";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("Set DIRECT_URL or DATABASE_URL before seeding.");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
        imageAlt: product.imageAlt,
        label: product.label,
        color: product.color,
        description: product.description,
        materials: product.materials,
        sizes: product.sizes,
        stock: product.stock,
        featured: Boolean(product.featured),
      },
      update: {
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
        imageAlt: product.imageAlt,
        label: product.label,
        color: product.color,
        description: product.description,
        materials: product.materials,
        sizes: product.sizes,
        featured: Boolean(product.featured),
      },
    });
  }
  console.log(`Seeded ${products.length} store products.`);
}

main().finally(async () => {
  await prisma.$disconnect();
});
