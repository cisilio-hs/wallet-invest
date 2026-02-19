<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\CustomAsset;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    /**
     * Search available assets for a wallet (both listed and unlisted).
     */
    public function availableAssets(Wallet $wallet, Request $request): JsonResponse
    {
        $this->authorize('view', $wallet);

        $search = $request->get('q', '');

        // Search listed assets by ticker or name
        $assetsQuery = Asset::query()
            ->with('type');

        if ($search) {
            $assetsQuery->where(function ($query) use ($search) {
                $query->where('ticker', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $assets = $assetsQuery
            ->limit(50)
            ->get()
            ->map(function ($asset) {
                return [
                    'asset_id' => $asset->id,
                    'custom_asset_id' => null,
                    'ticker' => $asset->ticker,
                    'name' => $asset->name,
                    'asset_type' => $asset->type?->name,
                    'market' => $asset->market,
                    'currency' => $asset->currency,
                    'source' => 'listed',
                ];
            });

        // Search custom assets by name (wallet-specific)
        $customAssetsQuery = CustomAsset::query()
            ->where('wallet_id', $wallet->id)
            ->with('type');

        if ($search) {
            $customAssetsQuery->where('name', 'like', "%{$search}%");
        }

        $customAssets = $customAssetsQuery
            ->limit(50)
            ->get()
            ->map(function ($customAsset) {
                return [
                    'asset_id' => null,
                    'custom_asset_id' => $customAsset->id,
                    'ticker' => null,
                    'name' => $customAsset->name,
                    'asset_type' => $customAsset->type?->name,
                    'market' => null,
                    'currency' => $customAsset->currency,
                    'source' => 'unlisted',
                ];
            });

        return response()->json([
            'assets' => $assets->concat($customAssets)->values(),
        ]);
    }
}
