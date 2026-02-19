import { forwardRef } from "react";

type SelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default forwardRef<HTMLSelectElement, SelectInputProps>(
    function SelectInput({ className = "", ...props }, ref) {
        return (
            <select
                {...props}
                ref={ref}
                className={
                    "rounded-md border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] " +
                    className
                }
            />
        );
    }
);
