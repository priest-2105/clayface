import { NextResponse } from "next/server";

export const DESIGN_SYSTEM_ERROR_MESSAGES = {
    AUTH_REQUIRED: "You must be signed in to manage design systems.",
    INVALID_INPUT: "Please check the design system form and try again.",
    DESIGN_SYSTEM_RATE_LIMITED: "Too many design system changes. Please try again later.",
    DESIGN_SYSTEM_NOT_FOUND: "That design system reference could not be found.",
    DESIGN_SYSTEM_CREATE_FAILED: "Failed to create design system reference.",
    DESIGN_SYSTEM_UPDATE_FAILED: "Failed to update design system reference.",
    DESIGN_SYSTEM_DELETE_FAILED: "Failed to delete design system reference.",
    DESIGN_SYSTEM_DUPLICATE_NAME: "A design system reference with that name already exists.",
} as const;

export type DesignSystemErrorCode = keyof typeof DESIGN_SYSTEM_ERROR_MESSAGES;

export function designSystemErrorResponse(code: DesignSystemErrorCode, status: number, extra?: Record<string, unknown>) {
    return NextResponse.json(
        {
            code,
            error: DESIGN_SYSTEM_ERROR_MESSAGES[code],
            ...extra,
        },
        { status }
    );
}

export function readDesignSystemErrorMessage(data: unknown, fallback = "Something went wrong. Please try again.") {
    if (!data || typeof data !== "object") {
        return fallback;
    }

    const payload = data as { code?: string; error?: string };

    if (payload.code && payload.code in DESIGN_SYSTEM_ERROR_MESSAGES) {
        return DESIGN_SYSTEM_ERROR_MESSAGES[payload.code as DesignSystemErrorCode];
    }

    if (payload.error) {
        return payload.error;
    }

    return fallback;
}
