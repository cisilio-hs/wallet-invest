type CardProps = {
    title?: string | React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    headerClass?: string;
    childrenClass?: string;
    footerClass?: string;
};

export default function Card({
    title,
    children,
    footer,
    className = "",
    headerClass= "",
    childrenClass = "",
    footerClass = "",
}: CardProps) {
    return (
        <div className={`mx-auto ${className}`}>
            <div className="overflow-hidden bg-[var(--card-bg)] shadow-sm sm:rounded-lg border border-[var(--border-color)]">

                {title && (
                    <div className={`border-b border-[var(--border-color)] px-6 py-4 font-semibold text-[var(--text-primary)] ${headerClass}`}>
                        {title}
                    </div>
                )}

                <div className={`p-6 text-[var(--text-primary)] ${childrenClass}`}>
                    {children}
                </div>

                {footer && (
                    <div className={`border-t border-[var(--border-color)] px-6 py-4 ${footerClass}`}>
                        {footer}
                    </div>
                )}

            </div>
        </div>
    );
}
