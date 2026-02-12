import TextInput from "@/Components/TextInput";
import FormInputBase from "./FormInputBase";

type Variant = "normal" | "top" | "inside";

type FormInputTextProps =
    React.InputHTMLAttributes<HTMLInputElement> & {
        label?: string;
        error?: string;
        icon?: React.ComponentType<{ className?: string }>;
        variant?: Variant;
        className?: string;
    };

export default function FormInputText({
    label,
    error,
    icon,
    variant = "normal",
    className = "",
    ...props
}: FormInputTextProps) {
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

    const inputExtraPadding = {
        normal: icon ? "pl-10" : "",
        top: icon ? "pl-10" : "",
        inside: `${icon ? "pl-10" : "pl-3"} pt-5`,
    }[variant];

    return (
        <FormInputBase
            label={label}
            error={error}
            icon={icon}
            variant={variant}
            className={className}
        >
            <TextInput
                {...props}
                className={`${baseInputClasses} ${inputExtraPadding}`}
            />
        </FormInputBase>
    );
}
