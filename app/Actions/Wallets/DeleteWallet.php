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
     */
    public function execute(Wallet $wallet): bool
    {
        return $wallet->delete();
    }
}
