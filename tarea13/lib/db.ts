import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: {
      provider: "sqlite",
      url: "file:./tarea13/dev.db",
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;

  prisma.$on("query", (e) => {
    console.log("Query:", e.query);
    console.log("Params:", e.params);
    console.log("Duration:", e.duration + "ms");
  });
}
