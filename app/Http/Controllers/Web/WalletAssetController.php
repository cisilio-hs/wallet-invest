<?php

namespace App\Http\Controllers\Web;

use App\Actions\WalletAssets\CreateWalletAsset;
use App\Actions\WalletAssets\DeleteWalletAsset;
use App\Actions\WalletAssets\UpdateWalletAsset;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWalletAssetRequest;
use App\Http\Requests\UpdateWalletAssetRequest;
use App\Models\Portfolio;
use App\Models\WalletAsset;

class WalletAssetController extends Controller
{
    /**
     * Display a listing of wallet assets for a portfolio.
     */
    public function index(Portfolio $portfolio)
    {
        $this->authorize('view', $portfolio);

        $walletAssets = $portfolio->walletAssets()
            ->with('asset')
            ->get();

        return response()->json([
            'wallet_assets' => $walletAssets
        ]);
    }

    /**
     * Store a newly created wallet asset.
     */
    public function store(StoreWalletAssetRequest $request, CreateWalletAsset $createWalletAsset)
    {
        $portfolio = Portfolio::findOrFail($request->portfolio_id);
        
        $this->authorize('create', [WalletAsset::class, $portfolio]);

        $walletAsset = $createWalletAsset->execute(
            portfolio: $portfolio,
            assetId: $request->asset_id,
            customName: $request->custom_name,
            quantity: (float) $request->quantity,
            averagePrice: (float) $request->average_price
        );

        return back()->with('success', 'Asset added successfully.');
    }

    /**
     * Display the specified wallet asset.
     */
    public function show(WalletAsset $walletAsset)
    {
        $this->authorize('view', $walletAsset);

        return response()->json([
            'wallet_asset' => $walletAsset->load('asset')
        ]);
    }

    /**
     * Update the specified wallet asset.
     */
    public function update(UpdateWalletAssetRequest $request, WalletAsset $walletAsset, UpdateWalletAsset $updateWalletAsset)
    {
        $this->authorize('update', $walletAsset);

        $updateWalletAsset->execute($walletAsset, $request->validated());

        return back()->with('success', 'Asset updated successfully.');
    }

    /**
     * Remove the specified wallet asset.
     */
    public function destroy(WalletAsset $walletAsset, DeleteWalletAsset $deleteWalletAsset)
    {
        $this->authorize('delete', $walletAsset);

        $deleteWalletAsset->execute($walletAsset);

        return back()->with('success', 'Asset removed successfully.');
    }
}
