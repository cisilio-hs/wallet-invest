import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePage } from "@inertiajs/react";
import { Wallet } from "@/types";

interface WalletContextType {
    wallets: Wallet[];
    currentWallet: Wallet | null;
    currentWalletId: number | null;
    selectWallet: (id: number) => void;
}

interface WalletProviderProps {
    children: ReactNode;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: WalletProviderProps) {
    const { wallets } = usePage().props as { wallets?: Wallet[] };

    const [currentWalletId, setCurrentWalletId] = useState<number | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("current_wallet_id");

        if (stored) {
            setCurrentWalletId(parseInt(stored));
        } else if (wallets && wallets.length > 0) {
            setCurrentWalletId(wallets[0].id);
            localStorage.setItem("current_wallet_id", String(wallets[0].id));
        }
    }, [wallets]);

    function selectWallet(id: number) {
        setCurrentWalletId(id);
        localStorage.setItem("current_wallet_id", String(id));
    }

    const currentWallet =
        wallets?.find((w) => w.id === currentWalletId) || null;

    return (
        <WalletContext.Provider
            value={{
                wallets: wallets || [],
                currentWallet,
                currentWalletId,
                selectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWalletContext(): WalletContextType {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWalletContext must be used within a WalletProvider");
    }
    return context;
}
