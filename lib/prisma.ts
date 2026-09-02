import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function getDatabaseUrl() {
    const raw = process.env.DATABASE_URL?.trim();

    if (!raw) {
        throw new Error("DATABASE_URL is required. Set a Postgres connection string with a username and password.");
    }

    const url = new URL(raw);

    if (!url.username || !url.password) {
        throw new Error("DATABASE_URL must include both a database username and password.");
    }

    const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    const sslMode = url.searchParams.get("sslmode");

    if (process.env.NODE_ENV === "production" && !isLocalHost && sslMode !== "require") {
        throw new Error("Production DATABASE_URL must include sslmode=require.");
    }

    return raw;
}

const adapter = new PrismaPg({
    connectionString: getDatabaseUrl(),
});

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma =
    global.prisma ??
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
