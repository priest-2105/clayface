import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { emailSchema, loginPasswordSchema, normalizeEmail } from "@/lib/auth-security";

export const googleOAuthEnabled =
    Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

function getNextAuthSecret() {
    const secret = process.env.NEXTAUTH_SECRET?.trim();

    if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
        throw new Error("NEXTAUTH_SECRET must be set to a strong secret before running in production.");
    }

    return secret;
}

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id: string;
            authVersion: number;
        };
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: getNextAuthSecret(),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const parsed = z
                    .object({
                        email: emailSchema,
                        password: loginPasswordSchema,
                    })
                    .safeParse(credentials);

                if (!parsed.success) {
                    return null;
                }

                const email = normalizeEmail(parsed.data.email);
                const user = await prisma.user.findUnique({
                    where: { email },
                    select: { id: true, name: true, email: true, image: true, passwordHash: true, authVersion: true, disabledAt: true },
                });

                if (!user) {
                    return null;
                }

                if (user.disabledAt) {
                    throw new Error("ACCOUNT_DISABLED");
                }

                if (!user.passwordHash) {
                    throw new Error("PASSWORD_SIGNIN_REQUIRED");
                }

                const isValid = await compare(parsed.data.password, user.passwordHash);

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    authVersion: user.authVersion,
                };
            },
        }),
        ...(googleOAuthEnabled
            ? [
                  GoogleProvider({
                      clientId: process.env.GOOGLE_CLIENT_ID || "",
                      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
                  }),
              ]
            : []),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user?.id) {
                token.id = user.id;
            }

            if (!token.id) {
                return token;
            }

            const currentUser = await prisma.user.findUnique({
                where: { id: token.id },
                select: { authVersion: true, disabledAt: true },
            });

            if (!currentUser || currentUser.disabledAt) {
                delete token.id;
                delete token.authVersion;
                return token;
            }

            if (user?.id) {
                token.authVersion = currentUser.authVersion;
            } else if (token.authVersion !== currentUser.authVersion) {
                delete token.id;
                delete token.authVersion;
            }

            return token;
        },
        async signIn({ user, account, profile }) {
            if (user?.id) {
                const currentUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { disabledAt: true },
                });

                if (currentUser?.disabledAt) {
                    return false;
                }
            }

            if (account?.provider === "google") {
                const googleProfile = profile as { email?: string; email_verified?: boolean } | undefined;

                if (!googleProfile?.email || googleProfile.email_verified !== true) {
                    return false;
                }
            }

            return true;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`;
            }

            try {
                const parsed = new URL(url);
                return parsed.origin === baseUrl ? url : `${baseUrl}/chat`;
            } catch {
                return `${baseUrl}/chat`;
            }
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id;
                session.user.authVersion = token.authVersion ?? 0;
            }

            return session;
        },
    },
};

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        authVersion?: number;
    }
}

export async function getActiveSession() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { authVersion: true, disabledAt: true },
    });

    if (!user || user.disabledAt || user.authVersion !== session.user.authVersion) {
        return null;
    }

    return session;
}
