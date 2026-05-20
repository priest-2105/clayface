import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dark min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background">
            {/* Left Side - Branding */}
            <div className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden
                bg-gradient-to-br from-[#020B18] via-[#071530] to-[#030E22]">

                {/* Ambient ice orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-sky-300/8 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                {/* Subtle grid lines for ice-crystal feel */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(147,197,253,1) 1px, transparent 1px), linear-gradient(90deg, rgba(147,197,253,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="z-10">
                    <Image
                        src="/logo.svg"
                        alt="Shiva Logo"
                        width={80}
                        height={40}
                        className="mb-8"
                    />
                    <h1 className="text-4xl font-display font-semibold tracking-[0.02em] mb-4 text-white">
                        Build software at the<br />speed of thought.
                    </h1>
                    <p className="text-blue-200/60 text-lg max-w-md leading-relaxed">
                        The constrained frontend compiler that turns prompts into production-ready code.
                    </p>
                </div>

                <div className="z-10 flex flex-col gap-2 text-sm text-blue-300/30">
                    <div className="flex flex-wrap gap-4">
                        <Link href="/privacy-policy" className="hover:text-blue-200 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-blue-200 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                    <div>&copy; {new Date().getFullYear()} Shiva AI. All rights reserved.</div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-6
                bg-gradient-to-br from-blue-50/80 via-background to-sky-50/50
                dark:from-[#020B18] dark:via-[#030D1E] dark:to-[#020B18]">
                <div className="w-full max-w-md">
                    <div className="md:hidden flex justify-center mb-8">
                        <Image
                            src="/logo.svg"
                            alt="Shiva Logo"
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
