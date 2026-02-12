<?php

namespace App\Actions\Wallets;

use App\Models\Wallet;

/**
 * Delete a wallet.
 */
class DeleteWallet
{
    /**
     * Execute the action.
     *
     * @param Wallet $wallet
     * @return bool
     */
    public function execute(Wallet $wallet): bool
    {
        return $wallet->delete();
    }
}
