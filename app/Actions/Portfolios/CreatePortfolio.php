<?php

namespace App\Actions\Portfolios;

use App\Models\Portfolio;
use App\Models\Wallet;

/**
 * Create a new portfolio within a wallet.
 */
class CreatePortfolio
{
    /**
     * Execute the action.
     */
    public function execute(
        Wallet $wallet,
        string $name,
        float $targetWeight = 0.0
    ): Portfolio {
        return Portfolio::create([
            'wallet_id' => $wallet->id,
            'name' => $name,
            'target_weight' => $targetWeight,
        ]);
    }
}
