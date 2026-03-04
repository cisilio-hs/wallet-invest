<?php

namespace App\Actions\Transactions;

use App\Actions\Positions\CreateOrMarkPositionDirty;
use App\Models\Transaction;
use App\Models\TransactionType;
use App\Models\Wallet;
use Carbon\Carbon;

class CreateTransaction
{
    public function __construct(
        private readonly CreateOrMarkPositionDirty $createOrMarkPositionDirty
    ) {}

    /**
     * Create a new transaction.
     *
     * @param  float  $quantity  Always positive, sign is determined by transaction type
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

        // Create empty position or mark as dirty
        $this->createOrMarkPositionDirty->execute($wallet, $assetId, $customAssetId);

        return $transaction;
    }
}
