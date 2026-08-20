import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function HelpPage() {
    return (
        <div className="dark min-h-screen bg-background px-4 py-8 text-foreground md:px-6">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">Help</p>
                    <h1 className="font-display text-4xl font-semibold tracking-tight">Get help with Clayface</h1>
                    <p className="max-w-2xl text-text-secondary">
                        Use this page for product guidance, auth troubleshooting, and reference setup.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border border-blue-200/40 bg-white/55 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]">
                        <CardHeader>
                            <CardTitle>Design systems references</CardTitle>
                            <CardDescription>Manage the source material Clayface should follow.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-text-secondary">
                            <p>Add Figma files, style guides, and reference links in Settings.</p>
                            <Link href="/settings?tab=design-systems" className="text-primary underline-offset-4 hover:underline">
                                Open design systems settings
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border border-blue-200/40 bg-white/55 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]">
                        <CardHeader>
                            <CardTitle>Figma integration</CardTitle>
                            <CardDescription>Connect Figma before importing or syncing files.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-text-secondary">
                            <p>Go to Integrations in Settings to connect your Figma account before using Figma MCP features.</p>
                            <Link href="/settings?tab=integrations" className="text-primary underline-offset-4 hover:underline">
                                Open integrations
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border border-blue-200/40 bg-white/55 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]">
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Account protection and session control.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-text-secondary">
                            <p>Use Account settings to change your password or disable the account.</p>
                            <Link href="/settings?tab=account" className="text-primary underline-offset-4 hover:underline">
                                Open account settings
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border border-blue-200/40 bg-white/55 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]">
                        <CardHeader>
                            <CardTitle>Contact</CardTitle>
                            <CardDescription>Need direct support?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-text-secondary">
                            <p>Use the app menu or the settings pages to reach the key support areas.</p>
                            <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                                Terms of service
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
