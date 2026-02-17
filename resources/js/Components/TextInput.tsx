import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    InputHTMLAttributes,
} from "react";

export interface TextInputHandle {
    focus: () => void;
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
}

const TextInput = forwardRef<TextInputHandle, TextInputProps>(
    (
        { type = "text", className = "", isFocused = false, ...props },
        ref
    ) => {
        const localRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => ({
            focus: () => {
                localRef.current?.focus();
            },
        }));

        useEffect(() => {
            if (isFocused) {
                localRef.current?.focus();
            }
        }, [isFocused]);

        return (
            <input
                {...props}
                type={type}
                className={`rounded-md border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] ${className}`}
                ref={localRef}
            />
        );
    }
);

export default TextInput;
