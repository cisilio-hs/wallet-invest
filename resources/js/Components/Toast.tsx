import { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setIsVisible(true);

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation to finish
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: CheckCircleIcon,
        error: ExclamationCircleIcon,
        info: InformationCircleIcon,
        warning: ExclamationCircleIcon,
    };

    const colors = {
        success: 'bg-green-50 border-green-400 text-green-800',
        error: 'bg-red-50 border-red-400 text-red-800',
        info: 'bg-blue-50 border-blue-400 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    };

    const Icon = icons[type];

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
        >
            <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colors[type]}`}
                role="alert"
            >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="ml-2 flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

interface ToastContainerProps {
    flash?: {
        success?: string;
        error?: string;
        info?: string;
        warning?: string;
    };
}

export function ToastContainer({ flash }: ToastContainerProps) {
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info' | 'warning' }>>([]);

    useEffect(() => {
        if (flash?.success) {
            addToast(flash.success, 'success');
        }
        if (flash?.error) {
            addToast(flash.error, 'error');
        }
        if (flash?.info) {
            addToast(flash.info, 'info');
        }
        if (flash?.warning) {
            addToast(flash.warning, 'warning');
        }
    }, [flash]);

    const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );
}
