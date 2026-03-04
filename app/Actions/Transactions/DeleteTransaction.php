<?php

namespace App\Actions\Transactions;

use App\Actions\Positions\CreateOrMarkPositionDirty;
use App\Models\Transaction;

class DeleteTransaction
{
    public function __construct(
        private readonly CreateOrMarkPositionDirty $createOrMarkPositionDirty
    ) {}

    /**
     * Delete a transaction.
     */
    public function execute(Transaction $transaction): void
    {
        $wallet = $transaction->wallet;
        $assetId = $transaction->asset_id;
        $customAssetId = $transaction->custom_asset_id;

        $transaction->delete();

        // Mark wallet as dirty (needs consolidation)
        $wallet->update(['is_dirty' => true]);

        // Create empty position or mark as dirty
        $this->createOrMarkPositionDirty->execute($wallet, $assetId, $customAssetId);
    }
}
