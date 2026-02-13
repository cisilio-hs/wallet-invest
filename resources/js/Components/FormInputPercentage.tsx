import TextInput from "@/Components/TextInput";
import FormInputBase from "./FormInputBase";
import { ChartPieIcon } from "@heroicons/react/24/outline";

type Variant = "normal" | "top" | "inside";

type FormInputPercentageProps =
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'min' | 'max' | 'step'> & {
        label?: string;
        error?: string;
        icon?: React.ComponentType<{ className?: string }>;
        variant?: Variant;
        className?: string;
        min?: number;
        max?: number;
        step?: number;
    };

export default function FormInputPercentage({
    label,
    error,
    icon = ChartPieIcon,
    variant = "normal",
    className = "",
    min = 0,
    max = 100,
    step = 0.01,
    onChange,
    ...props
}: FormInputPercentageProps) {
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
        normal: icon ? "pl-10 pr-10" : "pr-10",
        top: icon ? "pl-10 pr-10" : "pr-10",
        inside: `${icon ? "pl-10 pr-10" : "pl-3 pr-10"} pt-5`,
    }[variant];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value >= min && value <= max) {
            onChange?.(e);
        } else if (e.target.value === '') {
            onChange?.(e);
        }
    };

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
                type="number"
                min={min}
                max={max}
                step={step}
                onChange={handleChange}
                className={`${baseInputClasses} ${inputExtraPadding}`}
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none">
                %
            </span>
        </FormInputBase>
    );
}
