"use client";

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export function LandingNav() {
    return (
        <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 md:px-12
            bg-[rgba(8,9,10,0.85)] backdrop-blur-[12px] [backdrop-filter:blur(12px)_saturate(180%)]
            border-b border-border-standard">

            <Link href="/" className="flex items-center gap-2.5">
                <Image src="/logo.svg" alt="Clayface" width={28} height={28} />
                <span className="font-ui text-[15px] tracking-[-0.01em] text-foreground">Clayface</span>
            </Link>

            <div className="flex items-center gap-2">
                <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-sm">
                        Sign in
                    </Button>
                </Link>

                <Link href="/chat">
                    <Button variant="primary" size="sm" className="text-sm">
                        Start building
                    </Button>
                </Link>
            </div>
        </nav>
    );
}
