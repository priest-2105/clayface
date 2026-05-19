import { PrismaPg } from "@prisma/adapter-pg";
import * as PrismaClientPackage from "@prisma/client";

function getDatabaseUrl() {
    const raw = process.env.DATABASE_URL?.trim();

    if (!raw) {
        throw new Error("DATABASE_URL is required. Set a Postgres connection string with a username and password.");
    }

    const url = new URL(raw);

    if (!url.username || !url.password) {
        throw new Error("DATABASE_URL must include both a database username and password.");
    }

    return raw;
}

const adapter = new PrismaPg({
    connectionString: getDatabaseUrl(),
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
