<?php

namespace App\Http\Controllers\Web;

use App\Actions\Wallets\CreateWallet;
use App\Actions\Wallets\DeleteWallet;
use App\Actions\Wallets\ListWallets;
use App\Actions\Wallets\UpdateWallet;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWalletRequest;
use App\Http\Requests\UpdateWalletRequest;
use App\Models\Wallet;
use Inertia\Inertia;

class WalletController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ListWallets $listWallets)
    {
        $this->authorize('viewAny', Wallet::class);

        $wallets = $listWallets->execute(request()->user());

        return Inertia::render('Wallet/Index', [
            'wallets' => $wallets
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Wallet/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWalletRequest $request, CreateWallet $createWallet)
    {
        $this->authorize('create', Wallet::class);

        $createWallet->execute(
            user: $request->user(),
            name: $request->name
        );

        return redirect()->route('wallets.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Wallet $wallet)
    {
        $this->authorize('view', $wallet);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Wallet $wallet)
    {
        $this->authorize('update', $wallet);

        $wallet->load(['portfolios.walletAssets']);

        return Inertia::render('Wallet/Edit', [
            'wallet' => $wallet
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWalletRequest $request, Wallet $wallet, UpdateWallet $updateWallet)
    {
        $this->authorize('update', $wallet);

        $updateWallet->execute($wallet, $request->validated());

        return redirect()->route('wallets.edit', $wallet);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Wallet $wallet, DeleteWallet $deleteWallet)
    {
        $this->authorize('delete', $wallet);

        $deleteWallet->execute($wallet);

        return redirect()->route('wallets.index');
    }
}
