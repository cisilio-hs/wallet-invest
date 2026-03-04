<?php

namespace App\Actions\Positions;

use App\Models\Position;
use App\Models\Transaction;
use App\Models\Wallet;

class RecalculatePosition
{
    /**
     * Recalculate a position based on its transactions.
     * Note: Position must exist before calling this method.
     *
     * @return Position|null Returns null if quantity = 0 (position deleted)
     */
    public function execute(
        Wallet $wallet,
        ?int $assetId,
        ?int $customAssetId
    ): ?Position {
        $query = Transaction::where('wallet_id', $wallet->id)
            ->where(function ($q) use ($assetId, $customAssetId) {
                if ($assetId !== null) {
                    $q->where('asset_id', $assetId);
                }
                if ($customAssetId !== null) {
                    $q->orWhere('custom_asset_id', $customAssetId);
                }
            });

        $transactions = $query->get();

        if ($transactions->isEmpty()) {
            $this->deletePositionIfExists($wallet, $assetId, $customAssetId);

            return null;
        }

        $totalQuantity = $transactions->sum('quantity');
        $totalInvested = $transactions->sum('gross_amount');

        if ($totalQuantity <= 0) {
            $this->deletePositionIfExists($wallet, $assetId, $customAssetId);

            return null;
        }

        $averagePrice = $totalInvested / $totalQuantity;

        $position = Position::updateOrCreate(
            [
                'wallet_id' => $wallet->id,
                'asset_id' => $assetId,
                'custom_asset_id' => $customAssetId,
            ],
            [
                'quantity' => $totalQuantity,
                'average_price' => $averagePrice,
                'is_dirty' => false,
            ]
        );

        return $position;
    }

    /**
     * Delete position if it exists.
     */
    private function deletePositionIfExists(Wallet $wallet, ?int $assetId, ?int $customAssetId): void
    {
        Position::where('wallet_id', $wallet->id)
            ->where('asset_id', $assetId)
            ->where('custom_asset_id', $customAssetId)
            ->delete();
    }
}
