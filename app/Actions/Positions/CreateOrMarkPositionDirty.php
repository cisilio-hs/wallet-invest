<?php

namespace App\Actions\Positions;

use App\Models\Position;
use App\Models\Wallet;

class CreateOrMarkPositionDirty
{
    /**
     * Create an empty position or mark existing one as dirty.
     * Used when a transaction is created/updated/deleted.
     *
     * @return Position The position (created or updated)
     */
    public function execute(
        Wallet $wallet,
        ?int $assetId,
        ?int $customAssetId
    ): Position {
        $position = Position::where('wallet_id', $wallet->id)
            ->where('asset_id', $assetId)
            ->where('custom_asset_id', $customAssetId)
            ->first();

        if ($position) {
            $position->update(['is_dirty' => true]);

            return $position;
        }

        return Position::create([
            'wallet_id' => $wallet->id,
            'asset_id' => $assetId,
            'custom_asset_id' => $customAssetId,
            'quantity' => 0,
            'average_price' => 0,
            'is_dirty' => true,
        ]);
    }
}
