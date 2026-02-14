<?php

namespace App\Actions\WalletAssets;

use App\Models\Portfolio;
use App\Models\WalletAsset;

/**
 * Create a new wallet asset (listed or unlisted).
 */
class CreateWalletAsset
{
    /**
     * Execute the action.
     *
     * @param Portfolio $portfolio
     * @param int|null $assetId
     * @param string|null $customName
     * @param int $score
     * @param float $quantity
     * @param float $averagePrice
     * @return WalletAsset
     * @throws \InvalidArgumentException
     */
    public function execute(
        Portfolio $portfolio,
        ?int $assetId,
        ?string $customName,
        int $score,
        float $quantity,
        float $averagePrice
    ): WalletAsset {
        $walletId = $portfolio->wallet_id;

        // Validate: either asset_id OR custom_name, not both
        $hasAssetId = $assetId !== null;
        $hasCustomName = !empty($customName);

        if ($hasAssetId && $hasCustomName) {
            throw new \InvalidArgumentException('Cannot provide both asset_id and custom_name. Choose one.');
        }

        if (!$hasAssetId && !$hasCustomName) {
            throw new \InvalidArgumentException('Must provide either asset_id or custom_name.');
        }

        // For listed assets (asset_id provided)
        if ($hasAssetId) {
            // Check if asset already exists in wallet
            $exists = WalletAsset::where('wallet_id', $walletId)
                ->where('asset_id', $assetId)
                ->whereNull('custom_name')
                ->exists();

            if ($exists) {
                throw new \InvalidArgumentException('This asset is already in your wallet.');
            }

            return WalletAsset::create([
                'wallet_id' => $walletId,
                'portfolio_id' => $portfolio->id,
                'asset_id' => $assetId,
                'custom_name' => null,
                'score' => $score,
                'quantity' => $quantity,
                'average_price' => $averagePrice,
            ]);
        }

        // For unlisted assets (custom_name provided)
        $exists = WalletAsset::where('wallet_id', $walletId)
            ->whereNull('asset_id')
            ->where('custom_name', $customName)
            ->exists();

        if ($exists) {
            throw new \InvalidArgumentException('An unlisted asset with this name already exists in your wallet.');
        }

        return WalletAsset::create([
            'wallet_id' => $walletId,
            'portfolio_id' => $portfolio->id,
            'asset_id' => null,
            'custom_name' => $customName,
            'score' => $score,
            'quantity' => $quantity,
            'average_price' => $averagePrice,
        ]);
    }
}
