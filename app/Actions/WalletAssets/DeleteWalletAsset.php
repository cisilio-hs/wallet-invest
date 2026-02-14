<?php

namespace App\Actions\WalletAssets;

use App\Models\WalletAsset;

/**
 * Delete a wallet asset.
 */
class DeleteWalletAsset
{
    /**
     * Execute the action.
     *
     * @param WalletAsset $walletAsset
     * @return bool
     */
    public function execute(WalletAsset $walletAsset): bool
    {
        return $walletAsset->delete();
    }
}
