<?php

namespace App\Actions\Portfolios;

use App\Models\Wallet;
use App\Models\Portfolio;

/**
 * Create a new portfolio within a wallet.
 */
class CreatePortfolio
{
    /**
     * Execute the action.
     *
     * @param Wallet $wallet
     * @param string $name
     * @param string $currency
     * @param float $targetWeight
     * @return Portfolio
     */
    public function execute(
        Wallet $wallet, 
        string $name, 
        string $currency, 
        float $targetWeight = 0.0
    ): Portfolio {
        return Portfolio::create([
            'wallet_id' => $wallet->id,
            'name' => $name,
            'currency' => $currency,
            'target_weight' => $targetWeight,
        ]);
    }
}
