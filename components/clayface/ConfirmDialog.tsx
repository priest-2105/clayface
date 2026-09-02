"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";

export interface ConfirmDialogProps {
    trigger: React.ReactNode;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
    trigger,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = false,
    onConfirm,
}: ConfirmDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    async function confirm() {
        setLoading(true);
        await onConfirm();
        setLoading(false);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader className="flex-row items-start gap-3 space-y-0">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--r-1)] border border-error/25 bg-error/10 text-error">
                        <TriangleAlert className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </div>
                    <DialogClose />
                </DialogHeader>
                <DialogBody className="pt-0" />
                <DialogFooter>
                    <DialogClose className="h-9 w-auto px-4"> {cancelLabel}</DialogClose>
                    <Button
                        type="button"
                        variant={destructive ? "destructive" : "primary"}
                        loading={loading}
                        onClick={confirm}
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
