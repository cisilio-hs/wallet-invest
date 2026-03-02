<?php

namespace App\Actions\Transactions;

use App\Models\Transaction;

class DeleteTransaction
{
    /**
     * Delete a transaction.
     *
     * @param Transaction $transaction
     * @return void
     */
    public function execute(Transaction $transaction): void
    {
        $wallet = $transaction->wallet;

        $transaction->delete();

        // Mark wallet as dirty (needs consolidation)
        $wallet->update(['is_dirty' => true]);
    }
}
