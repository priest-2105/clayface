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

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id: string;
        };
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "database",
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
                    select: { id: true, name: true, email: true, image: true, passwordHash: true, disabledAt: true },
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
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
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
                return parsed.origin === baseUrl ? url : `${baseUrl}/chat/1`;
            } catch {
                return `${baseUrl}/chat/1`;
            }
        },
        async session({ session, user }) {
            if (session.user && user) {
                session.user.id = user.id;
            }

            return session;
        },
    },
};

export async function getActiveSession() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { disabledAt: true },
    });

    if (!user || user.disabledAt) {
        return null;
    }

    return session;
}
