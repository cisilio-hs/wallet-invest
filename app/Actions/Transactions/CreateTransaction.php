<?php

namespace App\Actions\Transactions;

use App\Models\Transaction;
use App\Models\TransactionType;
use App\Models\Wallet;
use Carbon\Carbon;

class CreateTransaction
{
    /**
     * Create a new transaction.
     *
     * @param Wallet $wallet
     * @param int $transactionTypeId
     * @param int|null $assetId
     * @param int|null $customAssetId
     * @param float $quantity Always positive, sign is determined by transaction type
     * @param float $unitPrice
     * @param string $currency
     * @param string|Carbon $tradedAt
     * @return Transaction
     */
    public function execute(
        Wallet $wallet,
        int $transactionTypeId,
        ?int $assetId,
        ?int $customAssetId,
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

        // Calculate gross_amount with sign (same as quantity)
        $grossAmount = $signedQuantity * $unitPrice;

        $transaction = Transaction::create([
            'wallet_id' => $wallet->id,
            'transaction_type_id' => $transactionTypeId,
            'asset_id' => $assetId,
            'custom_asset_id' => $customAssetId,
            'quantity' => $signedQuantity,
            'unit_price' => $unitPrice,
            'gross_amount' => $grossAmount,
            'currency' => $currency,
            'traded_at' => $tradedAt,
        ]);

        // Mark wallet as dirty (needs consolidation)
        $wallet->update(['is_dirty' => true]);

        return $transaction;
    }
}
