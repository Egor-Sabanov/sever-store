import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  severPrisma?: PrismaClient;
};

export function getPrisma() {
  const existing = globalForPrisma.severPrisma;
  if (existing) return existing;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");

  const adapter = new PrismaPg({ connectionString, max: 5 });
  const prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") globalForPrisma.severPrisma = prisma;
  return prisma;
}
