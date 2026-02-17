import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import React from "react";

type Variant = "normal" | "top" | "inside";

type FormInputBaseProps = {
    label?: string;
    error?: string;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: Variant;
    className?: string;
    children: React.ReactNode;
};

export default function FormInputBase({
    label,
    error,
    icon = undefined,
    variant = "normal",
    className = "",
    children,
}: FormInputBaseProps) {
    const hasError = !!error;

    const wrapperClasses = {
        normal: "",
        top: "relative mt-2",
        inside:
            "relative border border-[var(--border-color)] rounded-md shadow-sm focus-within:ring focus-within:ring-[var(--accent-color)]",
    }[variant];

    const labelClasses = {
        normal: hasError ? "text-red-500" : "text-[var(--text-secondary)]",

        top: `
            absolute -top-2 left-3 px-2 text-xs bg-[var(--card-bg)] z-10
            ${hasError ? "text-red-500" : "text-[var(--text-secondary)]"}
        `,

        inside: "absolute top-1 left-3 text-xs text-[var(--text-muted)]",
    }[variant];

    const iconWrapperClasses = {
        normal: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
        top: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
        inside:
            "absolute inset-y-0 left-0 pl-3 pt-[0.8rem] flex items-center pointer-events-none",
    }[variant];

    return (
        <div className={className}>
            <div className={wrapperClasses}>
                {label && (
                    <InputLabel className={labelClasses}>
                        {label}
                    </InputLabel>
                )}

                <div className={variant === "inside" ? "" : "relative"}>
                    {icon && (
                        <div className={iconWrapperClasses}>
                            {React.createElement(icon, { className: "h-4 w-4" })}
                        </div>
                    )}

                    {children}
                </div>
            </div>

            <InputError message={error} />
        </div>
    );
}
