import { prisma } from "@/lib/prisma";

export async function recordRateLimitHit(key: string, limit: number, windowMs: number) {
    const now = new Date();
    const resetAt = new Date(Date.now() + windowMs);

    if (Math.random() < 0.01) {
        await prisma.rateLimitBucket.deleteMany({
            where: {
                resetAt: {
                    lt: now,
                },
            },
        });
    }

    const existing = await prisma.rateLimitBucket.findUnique({
        where: { key },
        select: { resetAt: true },
    });

    if (!existing || existing.resetAt <= now) {
        await prisma.rateLimitBucket.upsert({
            where: { key },
            create: {
                key,
                count: 1,
                resetAt,
            },
            update: {
                count: 1,
                resetAt,
            },
        });

        return false;
    }

    const updated = await prisma.rateLimitBucket.update({
        where: { key },
        data: {
            count: {
                increment: 1,
            },
        },
        select: { count: true },
    });

    return updated.count > limit;
}
