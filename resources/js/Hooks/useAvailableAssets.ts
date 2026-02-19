import { useState, useCallback, useRef } from 'react';

export interface AvailableAsset {
    asset_id: number | null;
    custom_asset_id: number | null;
    ticker: string | null;
    name: string;
    asset_type: string | null;
    market: string | null;
    currency: string;
    source: 'listed' | 'unlisted';
}

interface UseAvailableAssetsReturn {
    assets: AvailableAsset[];
    loading: boolean;
    error: string | null;
    search: (query: string) => Promise<void>;
    clear: () => void;
}

export function useAvailableAssets(walletId: number): UseAvailableAssetsReturn {
    const [assets, setAssets] = useState<AvailableAsset[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const search = useCallback(async (query: string) => {
        // Clear previous debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        if (!query.trim()) {
            setAssets([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            setError(null);

            abortControllerRef.current = new AbortController();

            try {
                const response = await fetch(
                    `/api/wallets/${walletId}/available-assets?q=${encodeURIComponent(query)}`,
                    {
                        signal: abortControllerRef.current.signal,
                        credentials: 'include', // Important: sends session cookies
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Erro ao buscar ativos');
                }

                const data = await response.json();
                setAssets(data.assets || []);
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return; // Request was cancelled, ignore
                }
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
                setAssets([]);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce
    }, [walletId]);

    const clear = useCallback(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setAssets([]);
        setError(null);
        setLoading(false);
    }, []);

    return {
        assets,
        loading,
        error,
        search,
        clear,
    };
}
