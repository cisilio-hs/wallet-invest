import { forwardRef } from "react";

type SelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default forwardRef<HTMLSelectElement, SelectInputProps>(
    function SelectInput({ className = "", ...props }, ref) {
        return (
            <select
                {...props}
                ref={ref}
                className={
                    "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " +
                    className
                }
            />
        );
    }
);
