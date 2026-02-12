import { ReactNode, InputHTMLAttributes } from "react";

import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

type Variant = "normal" | "top" | "inside";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
    variant?: Variant;
    className?: string;
}

export default function FormInput({
    label,
    error,
    icon = null,
    variant = "normal",
    className = "",
    ...props
}: FormInputProps) {
    const hasError = !!error;


    const baseInputClasses = `
        w-full
        border
        rounded-md
        shadow-sm
        focus:ring
        focus:ring-opacity-50
        ${
            hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-indigo-300 focus:ring-indigo-200"
        }
    `;

    console.log(baseInputClasses);

    const wrapperClasses: Record<Variant, string> = {
        normal: "",
        top: "relative mt-2",
        inside: "relative border rounded-md shadow-sm focus-within:ring focus-within:ring-indigo-200",
    };

    const labelClasses: Record<Variant, string> = {
        normal: hasError ? "text-red-500" : "text-gray-600",

        top: `
            absolute -top-2 left-3 px-2 text-xs bg-white z-10
            ${hasError ? "text-red-500" : "text-gray-600"}
        `,

        inside: "absolute top-1 left-3 text-xs text-gray-500",
    };

    const iconWrapperClasses: Record<Variant, string> = {
        normal:
            "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",

        top: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",

        inside:
            "absolute inset-y-0 left-0 pl-3 pt-[0.8rem] flex items-center pointer-events-none",
    };

    const inputExtraPadding: Record<Variant, string> = {
        normal: icon ? "pl-10" : "",
        top: icon ? "pl-10" : "",
        inside: `${icon ? "pl-10" : "pl-3"} pt-5`,
    };

    return (
        <div className={className}>
            <div className={wrapperClasses[variant]}>
                {label && (
                    <InputLabel className={labelClasses[variant]}>
                        {label}
                    </InputLabel>
                )}

                <div
                    className={
                        variant === "normal" || variant === "top"
                            ? "relative"
                            : ""
                    }
                >
                    {icon && (
                        <div className={iconWrapperClasses[variant]}>
                            {icon}
                        </div>
                    )}

                    <TextInput
                        {...props}
                        className={`
                            ${baseInputClasses}
                            ${inputExtraPadding[variant]}
                        `}
                    />
                </div>
            </div>

            <InputError message={error} />
        </div>
    );
}
