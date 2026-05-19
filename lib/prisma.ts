import { PrismaPg } from "@prisma/adapter-pg";
import * as PrismaClientPackage from "@prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

declare global {
    var prisma: PrismaClientPackage.PrismaClient | undefined;
}

export const prisma =
    global.prisma ??
    new PrismaClientPackage.PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
