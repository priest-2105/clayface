import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background">
            {/* Left Side - Branding */}
            <div className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden
                bg-card-bg border-r border-border">

                <div className="z-10">
                    <Image
                        src="/logo.svg"
                        alt="Clayface Logo"
                        width={80}
                        height={40}
                        className="mb-8"
                    />
                    <h1 className="text-4xl font-heading font-semibold tracking-[0.02em] mb-4 text-foreground">
                        Build software at the<br />speed of thought.
                    </h1>
                    <p className="text-text-secondary text-lg max-w-md leading-relaxed">
                        The constrained frontend compiler that turns prompts into production-ready code.
                    </p>
                </div>

                <div className="z-10 flex flex-col gap-2 text-sm text-text-secondary">
                    <div className="flex flex-wrap gap-4">
                        <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                    <div>&copy; {new Date().getFullYear()} Clayface AI. All rights reserved.</div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-6 bg-background">
                <div className="w-full max-w-md">
                    <div className="md:hidden flex justify-center mb-8">
                        <Image
                            src="/logo.svg"
                            alt="Clayface Logo"
                            width={48}
                            height={48}
                        />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
