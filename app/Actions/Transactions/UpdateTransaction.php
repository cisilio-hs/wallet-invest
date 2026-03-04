<?php

namespace App\Actions\Transactions;

use App\Actions\Positions\CreateOrMarkPositionDirty;
use App\Models\Transaction;
use App\Models\TransactionType;
use Carbon\Carbon;

class UpdateTransaction
{
    public function __construct(
        private readonly CreateOrMarkPositionDirty $createOrMarkPositionDirty
    ) {}

    /**
     * Update a transaction.
     *
     * @param  float  $quantity  Always positive, sign is determined by transaction type
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

        // Create empty position or mark as dirty
        $this->createOrMarkPositionDirty->execute(
            $transaction->wallet,
            $transaction->asset_id,
            $transaction->custom_asset_id
        );

        return $transaction;
    }
}
