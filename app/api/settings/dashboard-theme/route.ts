import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getActiveSession } from "@/lib/auth";
import { getRequestIp, recordRateLimitHit } from "@/lib/auth-security";
import { authErrorResponse } from "@/lib/auth-errors";
import { dashboardThemeToDbValue, dashboardThemes, isDashboardThemeValue } from "@/lib/dashboard-theme";

const themeSchema = z.object({
    theme: z.string(),
});

export async function POST(request: Request) {
    try {
        const requestHeaders = await headers();
        const session = await getActiveSession();

        if (!session?.user?.id) {
            return authErrorResponse("AUTH_REQUIRED", 401);
        }

        const origin = requestHeaders.get("origin");
        const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
        const protocol = requestHeaders.get("x-forwarded-proto") || "http";
        const secFetchSite = requestHeaders.get("sec-fetch-site");

        if (origin && host && origin !== `${protocol}://${host}`) {
            return authErrorResponse("INVALID_REQUEST_ORIGIN", 403);
        }

        if (secFetchSite === "cross-site") {
            return authErrorResponse("CROSS_SITE_BLOCKED", 403);
        }

        const json = await request.json().catch(() => ({}));
        const parsed = themeSchema.safeParse(json);

        if (!parsed.success || !isDashboardThemeValue(parsed.data.theme)) {
            return authErrorResponse("INVALID_INPUT", 400, {
                detail: "Choose a valid dashboard theme.",
            });
        }

        const requestIp = getRequestIp(requestHeaders);
        if (recordRateLimitHit(`dashboard-theme:${requestIp}:${session.user.id}`, 20, 15 * 60 * 1000)) {
            return authErrorResponse("INVALID_INPUT", 429, {
                detail: "Too many appearance changes. Please try again later.",
            });
        }

        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: { dashboardTheme: dashboardThemeToDbValue(parsed.data.theme) },
            select: { dashboardTheme: true },
        });

        return NextResponse.json(
            {
                ok: true,
                theme: dashboardThemes.find((option) => option.value === parsed.data.theme)?.value ?? updated.dashboardTheme,
            },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("dashboard theme route failed", error);
        return authErrorResponse("INVALID_INPUT", 500, {
            detail: error instanceof Error ? error.message : undefined,
        });
    }
}

