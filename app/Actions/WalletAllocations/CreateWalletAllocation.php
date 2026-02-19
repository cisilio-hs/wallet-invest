<?php

namespace App\Actions\WalletAllocations;

use App\Models\Portfolio;
use App\Models\WalletAllocation;
use InvalidArgumentException;

class CreateWalletAllocation
{
    /**
     * Create a new wallet allocation.
     *
     * @throws InvalidArgumentException
     */
    public function execute(
        Portfolio $portfolio,
        ?int $assetId,
        ?int $customAssetId,
        int $score
    ): WalletAllocation {
        // Validate XOR - exactly one must be provided
        if (($assetId === null && $customAssetId === null) ||
            ($assetId !== null && $customAssetId !== null)) {
            throw new InvalidArgumentException(
                'Informe um ativo listado (asset_id) OU um ativo customizado (custom_asset_id), nunca ambos.'
            );
        }

        // Validate score
        if ($score < 0) {
            throw new InvalidArgumentException('O score deve ser maior ou igual a 0.');
        }

        return WalletAllocation::create([
            'wallet_id' => $portfolio->wallet_id,
            'portfolio_id' => $portfolio->id,
            'asset_id' => $assetId,
            'custom_asset_id' => $customAssetId,
            'score' => $score,
        ]);
    }
}
