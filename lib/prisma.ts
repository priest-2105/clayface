import { PrismaPg } from "@prisma/adapter-pg";
import * as PrismaClientPackage from "@prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

declare global {
    // Prisma 7's generated client types are exposed through a package wrapper that
    // is awkward for this TS setup to name directly, so keep the singleton loose here.
    var prisma: any;
}

export const prisma =
    global.prisma ??
    new (PrismaClientPackage as any).PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
