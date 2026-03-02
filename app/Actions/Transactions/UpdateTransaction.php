<?php

namespace App\Actions\Transactions;

use App\Models\Transaction;
use App\Models\TransactionType;
use Carbon\Carbon;

class UpdateTransaction
{
    /**
     * Update a transaction.
     *
     * @param Transaction $transaction
     * @param int $transactionTypeId
     * @param float $quantity Always positive, sign is determined by transaction type
     * @param float $unitPrice
     * @param string $currency
     * @param string|Carbon $tradedAt
     * @return Transaction
     */
    public function execute(
        Transaction $transaction,
        int $transactionTypeId,
        float $quantity,
        float $unitPrice,
        string $currency,
        string|Carbon $tradedAt
    ): Transaction {
        // Convert string to Carbon if needed
        if (is_string($tradedAt)) {
            $tradedAt = Carbon::parse($tradedAt);
        }

        // Get transaction type to determine quantity sign
        $transactionType = TransactionType::findOrFail($transactionTypeId);

        // Apply sign to quantity based on type
        $signedQuantity = $quantity;
        if ($transactionType->isNegative()) {
            $signedQuantity = -abs($quantity);
        } elseif ($transactionType->isPositive()) {
            $signedQuantity = abs($quantity);
        }
        // neutral keeps quantity as is (usually 0)

        // Recalculate gross_amount with sign (same as quantity)
        $grossAmount = $signedQuantity * $unitPrice;

        $transaction->update([
            'transaction_type_id' => $transactionTypeId,
            'quantity' => $signedQuantity,
            'unit_price' => $unitPrice,
            'gross_amount' => $grossAmount,
            'currency' => $currency,
            'traded_at' => $tradedAt,
        ]);

        // Mark wallet as dirty (needs consolidation)
        $transaction->wallet->update(['is_dirty' => true]);

        return $transaction;
    }
}
