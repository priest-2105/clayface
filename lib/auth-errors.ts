import { NextResponse } from "next/server";

export const AUTH_ERROR_MESSAGES = {
    INVALID_REQUEST_ORIGIN: "This request was blocked for security reasons. Please try again from the app.",
    CROSS_SITE_BLOCKED: "This request was blocked because it did not come from the app.",
    INVALID_INPUT: "Please check the form and try again.",
    SIGNUP_RATE_LIMITED: "Too many signup attempts. Please try again later.",
    ACCOUNT_ALREADY_EXISTS: "An account already exists for this email. Sign in or reset your password.",
    GOOGLE_ACCOUNT_ALREADY_EXISTS: "This email is already linked to Google sign-in. Use Continue with Google.",
    OAUTH_ACCOUNT_ALREADY_EXISTS: "This email is already linked with another sign-in method. Use that method to continue.",
    SIGNUP_FAILED: "Failed to create account.",
    AUTH_REQUIRED: "You must be signed in.",
    PASSWORD_CHANGE_RATE_LIMITED: "Too many password change attempts. Please try again later.",
    DISABLE_ACCOUNT_RATE_LIMITED: "Too many disable attempts. Please try again later.",
    ACCOUNT_UNAVAILABLE: "This account is unavailable.",
    CURRENT_PASSWORD_REQUIRED: "Current password is required.",
    CURRENT_PASSWORD_INCORRECT: "Current password is incorrect.",
    PASSWORD_CHANGE_FAILED: "Failed to change password.",
    DISABLE_ACCOUNT_FAILED: "Failed to disable account.",
    RESET_RATE_LIMITED: "Too many reset attempts. Please try again later.",
    RESET_TOKEN_INVALID: "This password reset link is invalid or has expired.",
    RESET_FAILED: "Failed to reset password.",
    FORGOT_RATE_LIMITED: "Too many reset attempts. Please try again later.",
    FORGOT_FAILED: "Failed to start password reset.",
    ACCOUNT_DISABLED: "This account is disabled.",
    PASSWORD_SIGNIN_REQUIRED: "Use Google sign-in for this account.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    ACCESS_DENIED: "This sign-in was blocked.",
    OAUTH_ACCOUNT_NOT_LINKED: "Use the sign-in method already linked to this account.",
    OAUTH_FAILED: "Google sign-in failed. Try again.",
    OAUTH_NOT_CONFIGURED: "Google sign-in is not configured for this environment.",
    OAUTH_EMAIL_UNVERIFIED: "Google account email is not verified.",
    INVALID_PASSWORD_MISMATCH: "Passwords do not match.",
    INVALID_RESET_LINK: "This password reset link is missing a token or was copied incorrectly.",
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERROR_MESSAGES;

export function authErrorResponse(code: AuthErrorCode, status: number, extra?: Record<string, unknown>) {
    return NextResponse.json(
        {
            code,
            error: AUTH_ERROR_MESSAGES[code],
            ...extra,
        },
        { status }
    );
}

export function getAuthErrorMessage(error?: string | null) {
    if (!error) {
        return "Something went wrong. Please try again.";
    }

    switch (error) {
        case "CredentialsSignin":
            return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
        case "OAuthAccountNotLinked":
            return AUTH_ERROR_MESSAGES.OAUTH_ACCOUNT_NOT_LINKED;
        case "OAuthSignin":
        case "OAuthCallback":
        case "OAuthCreateAccount":
        case "Callback":
        case "Verification":
            return AUTH_ERROR_MESSAGES.OAUTH_FAILED;
        case "AccessDenied":
            return AUTH_ERROR_MESSAGES.ACCESS_DENIED;
        case "Configuration":
            return AUTH_ERROR_MESSAGES.OAUTH_NOT_CONFIGURED;
    }

    const normalized = error as AuthErrorCode;

    if (normalized in AUTH_ERROR_MESSAGES) {
        return AUTH_ERROR_MESSAGES[normalized];
    }

    return error;
}

export function readAuthErrorMessage(data: unknown, fallback = "Something went wrong. Please try again.") {
    if (!data || typeof data !== "object") {
        return fallback;
    }

    const payload = data as { code?: string; error?: string };

    if (payload.code && payload.code in AUTH_ERROR_MESSAGES) {
        return AUTH_ERROR_MESSAGES[payload.code as AuthErrorCode];
    }

    if (payload.error) {
        return getAuthErrorMessage(payload.error);
    }

    return fallback;
}
