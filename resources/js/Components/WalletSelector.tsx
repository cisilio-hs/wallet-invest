import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import useWallet from "@/Hooks/useWallet";

import { PlusIcon, Cog6ToothIcon, ChevronUpIcon, WalletIcon } from "@heroicons/react/24/outline";

export default function WalletSelector() {
    const { wallets, currentWallet, selectWallet } = useWallet();

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 gap-3">
                    <WalletIcon className="h-5 w-5" />

                    {currentWallet ? currentWallet.name : "Selecionar Carteira"}

                    <ChevronUpIcon className="h-5 w-5" />
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content align="left">
                <Dropdown.Link
                    href={route("wallets.create")}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    Nova Carteira
                </Dropdown.Link>

                <div className="border-t border-gray-200 my-2"></div>

                {wallets?.map((wallet) => (
                    <div
                        key={wallet.id}
                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
                    >
                        <button
                            className="flex-1 text-left"
                            onClick={() => selectWallet(wallet.id)}
                        >
                            {wallet.name}
                        </button>

                        <NavLink
                            href={route("wallets.edit", wallet.id)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <Cog6ToothIcon className="h-4 w-4" />
                        </NavLink>
                    </div>
                ))}
            </Dropdown.Content>
        </Dropdown>
    );
}
