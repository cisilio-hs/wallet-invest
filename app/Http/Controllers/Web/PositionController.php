<?php

namespace App\Http\Controllers\Web;

use App\Actions\Positions\RecalculateAllPositions;
use App\Actions\Positions\RecalculatePosition;
use App\Http\Controllers\Controller;
use App\Models\Position;
use App\Models\Wallet;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PositionController extends Controller
{
    public function __construct(
        private readonly RecalculatePosition $recalculatePosition,
        private readonly RecalculateAllPositions $recalculateAllPositions
    ) {}

    /**
     * Display a listing of positions for the wallet.
     */
    public function index(Wallet $wallet): Response
    {
        $this->authorize('viewAny', [Position::class, $wallet]);

        $positions = $wallet->positions()
            ->hasQuantity()
            ->withAsset()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Position/Index', [
            'positions' => $positions,
            'wallet' => $wallet,
        ]);
    }

    /**
     * Display the specified position.
     */
    public function show(Wallet $wallet, Position $position): Response
    {
        $this->authorize('view', $position);

        $position->load(['asset', 'customAsset']);

        $transactions = $wallet->transactions()
            ->where(function ($q) use ($position) {
                $q->where('asset_id', $position->asset_id)
                    ->orWhere('custom_asset_id', $position->custom_asset_id);
            })
            ->with(['transaction_type'])
            ->orderBy('traded_at', 'desc')
            ->limit(50)
            ->get();

        return Inertia::render('Position/Show', [
            'position' => $position,
            'wallet' => $wallet,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Recalculate a specific position.
     */
    public function recalculate(Wallet $wallet, Position $position): RedirectResponse
    {
        $this->authorize('recalculate', $position);

        $this->recalculatePosition->execute(
            $wallet,
            $position->asset_id,
            $position->custom_asset_id
        );

        return redirect()->route('wallets.positions.show', [$wallet, $position])
            ->with('success', 'Position recalculada com sucesso.');
    }

    /**
     * Recalculate all positions for the wallet.
     */
    public function recalculateAll(Wallet $wallet): RedirectResponse
    {
        $this->authorize('viewAny', [Position::class, $wallet]);

        $results = $this->recalculateAllPositions->execute($wallet);

        $message = "Positions recalculadas: {$results['recalculated']}";
        if ($results['deleted'] > 0) {
            $message .= ", {$results['deleted']} deletadas";
        }

        return redirect()->route('wallets.positions.index', $wallet)
            ->with('success', $message);
    }
}
