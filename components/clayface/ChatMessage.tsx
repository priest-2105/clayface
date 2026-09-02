import * as React from "react";
import { Cpu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface ChatMessageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
    role: "user" | "assistant" | "system";
    content: React.ReactNode;
    time?: string;
    user?: {
        name?: string | null;
        image?: string | null;
    };
    meta?: React.ReactNode;
}

function initials(name?: string | null) {
    return (name || "CF")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
    ({ className, role, content, time, user, meta, ...props }, ref) => {
        const isUser = role === "user";

        return (
            <div ref={ref} className={cn("flex gap-3", isUser && "justify-end", className)} {...props}>
                {!isUser ? (
                    <span className="mt-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-border bg-primary/10 text-primary">
                        <Cpu className="h-4 w-4" aria-hidden="true" />
                    </span>
                ) : null}
                <div className={cn("flex max-w-[88%] flex-col gap-1.5", isUser && "items-end")}>
                    <div className="flex items-center gap-2 px-1 text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                        <span>{isUser ? "You" : role}</span>
                        {time ? (
                            <>
                                <span className="h-1 w-1 rounded-full bg-border" />
                                <span>{time}</span>
                            </>
                        ) : null}
                    </div>
                    <div
                        className={cn(
                            "rounded-[var(--r-3)] border px-4 py-3 text-sm leading-relaxed text-foreground",
                            isUser
                                ? "rounded-tr-[var(--r-1)] border-primary/20 bg-primary/12"
                                : "rounded-tl-[var(--r-1)] border-border bg-background"
                        )}
                    >
                        {content}
                    </div>
                    {meta ? <div className="flex flex-wrap gap-1.5 px-1">{meta}</div> : null}
                </div>
                {isUser ? (
                    <Avatar className="mt-6 h-8 w-8">
                        {user?.image ? <AvatarImage src={user.image} alt={user.name || "User avatar"} /> : null}
                        <AvatarFallback className="text-[11px]">{initials(user?.name)}</AvatarFallback>
                    </Avatar>
                ) : null}
            </div>
        );
    }
);
ChatMessage.displayName = "ChatMessage";

export function ChatMetaBadge({ children }: { children: React.ReactNode }) {
    return (
        <Badge variant="secondary" className="font-mono text-[10px]">
            {children}
        </Badge>
    );
}

export { ChatMessage };
