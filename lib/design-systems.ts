import { z } from "zod";

export const designSystemSourceTypes = [
    { value: "figma", label: "Figma file" },
    { value: "link", label: "Reference link" },
    { value: "upload", label: "Uploaded asset" },
    { value: "other", label: "Other reference" },
] as const;

export type DesignSystemSourceType = (typeof designSystemSourceTypes)[number]["value"];

export const designSystemSourceTypeSchema = z.enum(["figma", "link", "upload", "other"]);

export const designSystemReferenceSchema = z
    .object({
        name: z.string().trim().min(2, "Give the reference a short name.").max(80),
        description: z.string().trim().max(240).optional().or(z.literal("")),
        sourceType: designSystemSourceTypeSchema,
        sourceUrl: z.string().trim().max(500).optional().or(z.literal("")),
        figmaFileKey: z.string().trim().max(128).optional().or(z.literal("")),
        figmaNodeId: z.string().trim().max(128).optional().or(z.literal("")),
        notes: z.string().trim().max(1000).optional().or(z.literal("")),
        isPrimary: z.boolean().optional(),
    })
    .refine(
        (data) => Boolean(data.sourceUrl?.trim() || data.figmaFileKey?.trim() || data.notes?.trim()),
        {
            message: "Add a source URL, Figma file key, or notes so Clayface has a usable reference.",
            path: ["sourceUrl"],
        }
    );

export type DesignSystemReferenceInput = z.infer<typeof designSystemReferenceSchema>;

