import { z } from "zod";

export const projectStatuses = ["active", "review", "ready", "archived"] as const;
export type ProjectStatusValue = (typeof projectStatuses)[number];

export const projectChatStatuses = ["active", "draft", "archived"] as const;
export type ProjectChatStatusValue = (typeof projectChatStatuses)[number];

export const projectDesignTypes = ["page", "component", "flow", "section", "system"] as const;
export type ProjectDesignTypeValue = (typeof projectDesignTypes)[number];

export const projectDesignStatuses = ["draft", "review", "ready", "archived"] as const;
export type ProjectDesignStatusValue = (typeof projectDesignStatuses)[number];

export const projectStatusValueMap = {
    active: "ACTIVE",
    review: "REVIEW",
    ready: "READY",
    archived: "ARCHIVED",
} as const;

export const projectChatStatusValueMap = {
    active: "ACTIVE",
    draft: "DRAFT",
    archived: "ARCHIVED",
} as const;

export const projectDesignTypeValueMap = {
    page: "PAGE",
    component: "COMPONENT",
    flow: "FLOW",
    section: "SECTION",
    system: "SYSTEM",
} as const;

export const projectDesignStatusValueMap = {
    draft: "DRAFT",
    review: "REVIEW",
    ready: "READY",
    archived: "ARCHIVED",
} as const;

export const projectCreateSchema = z.object({
    name: z.string().trim().min(2, "Give the project a short name.").max(80),
    description: z.string().trim().max(240).optional().or(z.literal("")),
    accent: z.string().trim().max(32).optional().or(z.literal("")),
});

export const projectUpdateSchema = projectCreateSchema.partial().extend({
    status: z.enum(projectStatuses).optional(),
});

export const projectChatCreateSchema = z.object({
    title: z.string().trim().min(2, "Give the chat a short title.").max(120),
    summary: z.string().trim().max(240).optional().or(z.literal("")),
});

export const projectDesignCreateSchema = z.object({
    title: z.string().trim().min(2, "Give the design a short title.").max(120),
    description: z.string().trim().max(240).optional().or(z.literal("")),
    designType: z.enum(projectDesignTypes).optional(),
    status: z.enum(projectDesignStatuses).optional(),
    chatId: z.string().trim().optional().or(z.literal("")),
    sourceFigmaFileKey: z.string().trim().max(128).optional().or(z.literal("")),
    sourceFigmaNodeId: z.string().trim().max(128).optional().or(z.literal("")),
    previewUrl: z.string().trim().max(500).optional().or(z.literal("")),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export function slugifyProjectName(name: string) {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 64) || "project";
}
