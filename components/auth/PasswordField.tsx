"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { FormDescription, FormField, FormLabel } from "@/components/ui/Form";

type PasswordFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    autoComplete?: string;
    placeholder?: string;
    required?: boolean;
    helperText?: string;
};

export function PasswordField({
    id,
    label,
    value,
    onChange,
    autoComplete,
    placeholder,
    required = false,
    helperText,
}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <FormField>
            <FormLabel htmlFor={id}>
                {label}
            </FormLabel>
            <div className="relative">
                <Input
                    id={id}
                    type={visible ? "text" : "password"}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    required={required}
                    className="pr-12"
                />
                <button
                    type="button"
                    onClick={() => setVisible((current) => !current)}
                    aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary transition-colors hover:text-foreground"
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {helperText ? <FormDescription>{helperText}</FormDescription> : null}
        </FormField>
    );
}
