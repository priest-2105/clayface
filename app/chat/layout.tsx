import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDashboardThemeConfig, dashboardThemeFromDbValue } from "@/lib/dashboard-theme";
import { ChatShell } from "@/components/chat/ChatShell";

type SidebarProject = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    lastOpenedAt: Date | null;
    chats: Array<{
        id: string;
        title: string;
        summary: string | null;
        updatedAt: Date;
    }>;
};

export default async function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getActiveSession();

    if (!session?.user) {
        redirect("/login?callbackUrl=/chat");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { dashboardTheme: true },
    });

    const projects = (await prisma.project.findMany({
        where: { userId: session.user.id },
        orderBy: [{ lastOpenedAt: "desc" }, { updatedAt: "desc" }],
        take: 5,
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            status: true,
            lastOpenedAt: true,
            chats: {
                orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
                take: 1,
                select: {
                    id: true,
                    title: true,
                    summary: true,
                    updatedAt: true,
                },
            },
        },
    })) as SidebarProject[];

    const themeConfig = getDashboardThemeConfig(dashboardThemeFromDbValue(user?.dashboardTheme));

    return (
        <div className={`${themeConfig.className} ${themeConfig.mode === "dark" ? "dark" : ""}`}>
            <ChatShell user={session.user} themeLabel={themeConfig.label} projects={projects}>
                {children}
            </ChatShell>
        </div>
    );
}
