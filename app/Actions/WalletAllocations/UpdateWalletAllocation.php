<?php

namespace App\Actions\WalletAllocations;

use App\Models\WalletAllocation;
use InvalidArgumentException;

class UpdateWalletAllocation
{
    /**
     * Update a wallet allocation score.
     *
     * @throws InvalidArgumentException
     */
    public function execute(WalletAllocation $walletAllocation, int $score): WalletAllocation
    {
        // Validate score
        if ($score < 0) {
            throw new InvalidArgumentException('O score deve ser maior ou igual a 0.');
        }

        $walletAllocation->update([
            'score' => $score,
        ]);

        return $walletAllocation;
    }
}
