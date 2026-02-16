<?php

namespace App\Actions\Wallets;

use App\Models\Wallet;

/**
 * Update an existing wallet.
 */
class UpdateWallet
{
    /**
     * Execute the action.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(Wallet $wallet, array $data): Wallet
    {
        $wallet->update($data);

        return $wallet->fresh();
    }
}
