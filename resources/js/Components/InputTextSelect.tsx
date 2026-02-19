import { useState, useRef, useEffect } from 'react';
import { useAvailableAssets, AvailableAsset } from '@/Hooks/useAvailableAssets';
import { t } from '@/i18n';
import { MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/24/outline';

interface InputTextSelectProps {
    walletId: number;
    value: AvailableAsset | null;
    onSelect: (asset: AvailableAsset | null) => void;
    placeholder?: string;
    error?: string;
    label?: string;
}

export default function InputTextSelect({
    walletId,
    value,
    onSelect,
    placeholder,
    error,
    label,
}: InputTextSelectProps) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { assets, loading, search, clear } = useAvailableAssets(walletId);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update input value when value prop changes
    useEffect(() => {
        if (value) {
            setInputValue(value.ticker || value.name);
        } else {
            setInputValue('');
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        
        if (newValue.trim()) {
            search(newValue);
            setIsOpen(true);
        } else {
            clear();
            setIsOpen(false);
            onSelect(null);
        }
    };

    const handleSelect = (asset: AvailableAsset) => {
        onSelect(asset);
        setInputValue(asset.ticker || asset.name);
        setIsOpen(false);
        clear();
    };

    const handleClear = () => {
        setInputValue('');
        onSelect(null);
        clear();
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            {label && (
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    {label}
                </label>
            )}
            
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-[var(--text-muted)]" />
                </div>
                
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder || t('portfolios.edit.select_asset')}
                    className={`
                        w-full pl-10 pr-10 py-2
                        border rounded-md shadow-sm
                        bg-[var(--card-bg)]
                        text-[var(--text-primary)]
                        placeholder-[var(--text-muted)]
                        focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]
                        ${error ? 'border-red-500' : 'border-[var(--border-color)]'}
                    `}
                />
                
                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                        <span className="text-lg">×</span>
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-auto">
                    {loading && (
                        <div className="px-4 py-3 text-sm text-[var(--text-muted)]">
                            {t('common.loading')}
                        </div>
                    )}

                    {!loading && assets.length === 0 && inputValue.trim() && (
                        <div className="px-4 py-3 text-sm text-[var(--text-muted)]">
                            {t('portfolios.edit.no_results')}
                        </div>
                    )}

                    {!loading && assets.map((asset) => (
                        <button
                            key={`${asset.source}-${asset.asset_id || asset.custom_asset_id}`}
                            onClick={() => handleSelect(asset)}
                            className={`
                                w-full px-4 py-3 text-left hover:bg-[var(--sidebar-hover)]
                                flex items-center justify-between
                                border-b border-[var(--border-color)] last:border-0
                                ${value?.asset_id === asset.asset_id && value?.custom_asset_id === asset.custom_asset_id
                                    ? 'bg-[var(--sidebar-hover)]'
                                    : ''
                                }
                            `}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-[var(--text-primary)]">
                                        {asset.ticker || asset.name}
                                    </span>
                                    <span className={`
                                        text-xs px-2 py-0.5 rounded-full
                                        ${asset.source === 'listed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }
                                    `}>
                                        {asset.source === 'listed'
                                            ? t('portfolios.edit.type_listed')
                                            : t('portfolios.edit.type_unlisted')
                                        }
                                    </span>
                                </div>
                                <div className="text-sm text-[var(--text-muted)] mt-0.5">
                                    {asset.name}
                                    {asset.asset_type && ` • ${asset.asset_type}`}
                                    {asset.market && ` • ${asset.market}`}
                                </div>
                            </div>
                            
                            {value?.asset_id === asset.asset_id && value?.custom_asset_id === asset.custom_asset_id && (
                                <CheckIcon className="h-5 w-5 text-[var(--accent-color)]" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
