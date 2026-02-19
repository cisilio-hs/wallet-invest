<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomAssetRequest;
use App\Http\Requests\UpdateCustomAssetRequest;
use App\Models\AssetType;
use App\Models\CustomAsset;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomAssetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $wallet = auth()->user()->person->wallets()->first(); // TODO: Get selected wallet
        
        $customAssets = CustomAsset::where('wallet_id', $wallet->id)
            ->with('type')
            ->get();

        return Inertia::render('CustomAsset/Index', [
            'customAssets' => $customAssets,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $assetTypes = AssetType::all();

        return Inertia::render('CustomAsset/Create', [
            'assetTypes' => $assetTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomAssetRequest $request): RedirectResponse
    {
        $wallet = auth()->user()->person->wallets()->first(); // TODO: Get selected wallet
        
        CustomAsset::create([
            'wallet_id' => $wallet->id,
            'name' => $request->name,
            'asset_type_id' => $request->asset_type_id,
            'currency' => $request->currency,
        ]);

        return redirect()->route('custom-assets.index')->with('success', 'Ativo criado com sucesso.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CustomAsset $customAsset): Response
    {
        $this->authorize('update', $customAsset);

        $assetTypes = AssetType::all();

        return Inertia::render('CustomAsset/Edit', [
            'customAsset' => $customAsset,
            'assetTypes' => $assetTypes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomAssetRequest $request, CustomAsset $customAsset): RedirectResponse
    {
        $this->authorize('update', $customAsset);

        $customAsset->update([
            'name' => $request->name,
            'asset_type_id' => $request->asset_type_id,
            'currency' => $request->currency,
        ]);

        return redirect()->route('custom-assets.index')->with('success', 'Ativo atualizado com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomAsset $customAsset): RedirectResponse
    {
        $this->authorize('delete', $customAsset);

        // Check if there are any allocations or transactions
        if ($customAsset->walletAllocations()->exists() || $customAsset->transactions()->exists()) {
            return back()->with('error', 'Não é possível excluir este ativo pois existem alocações ou transações vinculadas.');
        }

        $customAsset->delete();

        return redirect()->route('custom-assets.index')->with('success', 'Ativo removido com sucesso.');
    }
}
