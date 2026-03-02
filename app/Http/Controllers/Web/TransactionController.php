<?php

namespace App\Http\Controllers\Web;

use App\Actions\Transactions\CreateTransaction;
use App\Actions\Transactions\DeleteTransaction;
use App\Actions\Transactions\UpdateTransaction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\AssetType;
use App\Models\Transaction;
use App\Models\TransactionType;
use App\Models\Wallet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'wallet_id' => ['nullable', 'integer', 'exists:wallets,id'],
        ]);

        $wallet = auth()->user()->person->wallets()
            ->where('id', $validated['wallet_id'] ?? 0)
            ->first();

        $this->authorize('viewAny', [Transaction::class, $wallet]);

        $transactions = Transaction::where('wallet_id', $wallet?->id)
            ->with(['asset', 'custom_asset', 'transaction_type'])
            ->orderBy('traded_at', 'desc')
            ->paginate(20);

        return Inertia::render('Transaction/Index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $assetTypes = AssetType::all();
        $transactionTypes = TransactionType::active()->get();

        return Inertia::render('Transaction/Create', [
            'assetTypes' => $assetTypes,
            'transactionTypes' => $transactionTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request, CreateTransaction $createTransaction): RedirectResponse
    {
        $wallet = Wallet::findOrFail($request->wallet_id);

        $this->authorize('create', [Transaction::class, $wallet]);
        
        $createTransaction->execute(
            wallet: $wallet,
            transactionTypeId: $request->transaction_type_id,
            assetId: $request->asset_id,
            customAssetId: $request->custom_asset_id,
            quantity: $request->quantity,
            unitPrice: $request->unit_price,
            currency: $request->currency,
            tradedAt: $request->traded_at
        );

        return redirect()->route('transactions.index')->with('success', 'Transação criada com sucesso.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction): Response
    {
        $this->authorize('update', $transaction);

        $assetTypes = AssetType::all();
        $transactionTypes = TransactionType::active()->get();
        
        // Load asset relationships
        $transaction->load(['asset', 'custom_asset', 'transaction_type']);

        return Inertia::render('Transaction/Edit', [
            'transaction' => $transaction,
            'assetTypes' => $assetTypes,
            'transactionTypes' => $transactionTypes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction, UpdateTransaction $updateTransaction): RedirectResponse
    {
        $this->authorize('update', $transaction);

        $updateTransaction->execute(
            transaction: $transaction,
            transactionTypeId: $request->transaction_type_id,
            quantity: $request->quantity,
            unitPrice: $request->unit_price,
            currency: $request->currency,
            tradedAt: $request->traded_at
        );

        return redirect()->route('transactions.index')->with('success', 'Transação atualizada com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction, DeleteTransaction $deleteTransaction): RedirectResponse
    {
        $this->authorize('delete', $transaction);

        $deleteTransaction->execute($transaction);

        return redirect()->route('transactions.index')->with('success', 'Transação removida com sucesso.');
    }
}
