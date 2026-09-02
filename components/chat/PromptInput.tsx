"use client";

import * as React from "react";
import { PromptBox, type PromptAttachment } from "@/components/clayface";

export function PromptInput() {
    const [value, setValue] = React.useState("");
    const [attachments, setAttachments] = React.useState<PromptAttachment[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;

        if (!files) {
            return;
        }

        setAttachments((current) => [
            ...current,
            ...Array.from(files).map((file) => ({
                id: `${file.name}-${file.lastModified}-${file.size}`,
                name: file.name,
                type: file.type,
                previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
            })),
        ]);

        event.target.value = "";
    }

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={handleFileSelect}
            />
            <PromptBox
                value={value}
                attachments={attachments}
                onValueChange={setValue}
                onAttach={(accept) => {
                    if (fileInputRef.current) {
                        fileInputRef.current.accept = accept;
                        fileInputRef.current.click();
                    }
                }}
                onRemoveAttachment={(id) => setAttachments((current) => current.filter((attachment) => attachment.id !== id))}
                onSubmitPrompt={() => setValue("")}
            />
        </>
    );
}
