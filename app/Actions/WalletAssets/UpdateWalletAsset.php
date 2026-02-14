<?php

namespace App\Actions\WalletAssets;

use App\Models\WalletAsset;

/**
 * Update an existing wallet asset.
 */
class UpdateWalletAsset
{
    /**
     * Execute the action.
     *
     * @param WalletAsset $walletAsset
     * @param array<string, mixed> $data
     * @return WalletAsset
     */
    public function execute(WalletAsset $walletAsset, array $data): WalletAsset
    {
        // Only allow updating quantity and average_price
        // Changing from listed to unlisted (or vice versa) requires delete + recreate
        $allowedFields = ['quantity', 'average_price'];
        
        $updateData = array_intersect_key($data, array_flip($allowedFields));
        
        $walletAsset->update($updateData);
        
        return $walletAsset->fresh();
    }
}
