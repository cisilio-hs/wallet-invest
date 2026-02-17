<?php

namespace App\Http\Controllers\Web;

use App\Actions\Portfolios\CreatePortfolio;
use App\Actions\Portfolios\DeletePortfolio;
use App\Actions\Portfolios\UpdatePortfolio;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePortfolioRequest;
use App\Http\Requests\UpdatePortfolioRequest;
use App\Models\Portfolio;
use App\Models\Wallet;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // To be implemented
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // To be implemented
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePortfolioRequest $request, CreatePortfolio $createPortfolio)
    {
        $wallet = Wallet::findOrFail($request->wallet_id);

        $this->authorize('create', [Portfolio::class, $wallet]);

        $createPortfolio->execute(
            wallet: $wallet,
            name: $request->name,
            targetWeight: $request->target_weight ?? 0.0
        );

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Portfolio $portfolio)
    {
        // To be implemented
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Portfolio $portfolio)
    {
        $this->authorize('update', $portfolio);

        $portfolio->load('walletAllocations.asset');

        return Inertia::render('Portfolio/Edit', [
            'portfolio' => $portfolio,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePortfolioRequest $request, Portfolio $portfolio, UpdatePortfolio $updatePortfolio)
    {
        $this->authorize('update', $portfolio);

        $updatePortfolio->execute($portfolio, $request->validated());

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Portfolio $portfolio, DeletePortfolio $deletePortfolio)
    {
        $this->authorize('delete', $portfolio);

        $deletePortfolio->execute($portfolio);

        return back();
    }
}
