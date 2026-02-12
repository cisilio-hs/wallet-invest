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
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-200">

                {title && (
                    <div className={`border-b border-gray-200 px-6 py-4 font-semibold text-gray-700 ${headerClass}`}>
                        {title}
                    </div>
                )}

                <div className={`p-6 text-gray-900 ${childrenClass}`}>
                    {children}
                </div>

                {footer && (
                    <div className={`border-t border-gray-200 px-6 py-4 ${footerClass}`}>
                        {footer}
                    </div>
                )}

            </div>
        </div>
    );
}
