<?php

namespace App\Http\Controllers\Web;

use App\Actions\WalletAllocations\CreateWalletAllocation;
use App\Actions\WalletAllocations\DeleteWalletAllocation;
use App\Actions\WalletAllocations\UpdateWalletAllocation;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWalletAllocationRequest;
use App\Http\Requests\UpdateWalletAllocationRequest;
use App\Models\Portfolio;
use App\Models\WalletAllocation;
use Illuminate\Http\RedirectResponse;

class WalletAllocationController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWalletAllocationRequest $request, CreateWalletAllocation $createWalletAllocation): RedirectResponse
    {
        $portfolio = Portfolio::findOrFail($request->portfolio_id);
        
        $this->authorize('create', [WalletAllocation::class, $portfolio]);

        $createWalletAllocation->execute(
            portfolio: $portfolio,
            assetId: $request->asset_id,
            customAssetId: $request->custom_asset_id,
            score: $request->score
        );

        return back()->with('success', 'Alocação criada com sucesso.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWalletAllocationRequest $request, WalletAllocation $walletAllocation, UpdateWalletAllocation $updateWalletAllocation): RedirectResponse
    {
        $this->authorize('update', $walletAllocation);

        $updateWalletAllocation->execute(
            walletAllocation: $walletAllocation,
            score: $request->score
        );

        return back()->with('success', 'Alocação atualizada com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WalletAllocation $walletAllocation, DeleteWalletAllocation $deleteWalletAllocation): RedirectResponse
    {
        $this->authorize('delete', $walletAllocation);

        $deleteWalletAllocation->execute($walletAllocation);

        return back()->with('success', 'Alocação removida com sucesso.');
    }
}
