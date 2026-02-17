import React from "react";

export type Column<T> = {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
    grow?: boolean;
    className?: string;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    actions?: (item: T) => React.ReactNode;
    className?: string;
};

export default function DataTable<T>({
    columns,
    data,
    actions,
    className = "",
}: DataTableProps<T>) {

    return (
        <div className={`bg-[var(--card-bg)] shadow rounded-lg border border-[var(--border-color)] ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--border-color)]">
                    <thead className="bg-[var(--sidebar-hover)]">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`
                                        px-3 py-1.5
                                        text-left text-sm font-semibold text-[var(--text-primary)]
                                        ${col.grow ? "w-full" : "whitespace-nowrap"}
                                        ${col.className || ""}
                                    `}
                                >
                                    {col.label}
                                </th>
                            ))}

                            {actions && (
                                <th
                                    className="
                                        px-3 py-1.5
                                        text-right text-sm font-semibold text-[var(--text-primary)]
                                    "
                                >

                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[var(--border-color)]">
                        {data.map((item, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-[var(--sidebar-hover)] transition-colors"
                            >
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`
                                            px-3 py-1.5
                                            text-sm text-[var(--text-primary)]
                                            ${col.grow ? "w-full" : "whitespace-nowrap"}
                                            ${col.className || ""}
                                        `}
                                    >
                                        {col.render
                                            ? col.render(item)
                                            : // @ts-ignore
                                              item[col.key]}
                                    </td>
                                ))}

                                {actions && (
                                    <td
                                        className="
                                            px-3 py-1.5
                                            text-right whitespace-nowrap
                                        "
                                    >
                                        {actions(item)}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
