<?php

namespace App\Observers;

use App\Models\Position;
use App\Models\Transaction;

class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        $this->markWalletAndPositionAsDirty($transaction);
    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {
        $this->markWalletAndPositionAsDirty($transaction);
    }

    /**
     * Mark the wallet and associated position as dirty when a transaction is created or updated.
     */
    private function markWalletAndPositionAsDirty(Transaction $transaction): void
    {
        // Mark wallet as dirty
        $transaction->wallet->update(['is_dirty' => true]);

        // Find or create position and mark it as dirty
        $position = Position::query()
            ->where('wallet_id', $transaction->wallet_id)
            ->where(function ($query) use ($transaction) {
                if ($transaction->asset_id) {
                    $query->where('asset_id', $transaction->asset_id);
                } else {
                    $query->whereNull('asset_id');
                }

                if ($transaction->custom_asset_id) {
                    $query->where('custom_asset_id', $transaction->custom_asset_id);
                } else {
                    $query->whereNull('custom_asset_id');
                }
            })
            ->first();

        if ($position) {
            $position->update(['is_dirty' => true]);
        }
    }
}
