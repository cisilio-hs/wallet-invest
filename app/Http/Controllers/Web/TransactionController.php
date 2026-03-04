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
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions for the wallet.
     */
    public function index(Wallet $wallet): Response
    {
        $this->authorize('viewAny', [Transaction::class, $wallet]);

        $transactions = Transaction::where('wallet_id', $wallet->id)
            ->with(['asset', 'custom_asset', 'transaction_type'])
            ->orderBy('traded_at', 'desc')
            ->paginate(20);

        return Inertia::render('Transaction/Index', [
            'transactions' => $transactions,
            'wallet' => $wallet,
        ]);
    }

    /**
     * Show the form for creating a new transaction.
     */
    public function create(Wallet $wallet): Response
    {
        $assetTypes = AssetType::all();
        $transactionTypes = TransactionType::active()->get();

        return Inertia::render('Transaction/Create', [
            'wallet' => $wallet,
            'assetTypes' => $assetTypes,
            'transactionTypes' => $transactionTypes,
        ]);
    }

    /**
     * Store a newly created transaction.
     */
    public function store(
        StoreTransactionRequest $request,
        Wallet $wallet,
        CreateTransaction $createTransaction
    ): RedirectResponse {
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

        return redirect()->route('wallets.transactions.index', $wallet)
            ->with('success', 'Transação criada com sucesso.');
    }

    /**
     * Display the transaction.
     */
    public function show(Transaction $transaction): Response
    {
        $this->authorize('view', $transaction);

        $transaction->load(['asset', 'custom_asset', 'transaction_type']);

        return Inertia::render('Transaction/Edit', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Show the form for editing the transaction.
     */
    public function edit(Wallet $wallet, Transaction $transaction): Response
    {
        $this->authorize('update', $transaction);

        $assetTypes = AssetType::all();
        $transactionTypes = TransactionType::active()->get();

        $transaction->load(['asset', 'custom_asset', 'transaction_type']);

        return Inertia::render('Transaction/Edit', [
            'wallet' => $wallet,
            'transaction' => $transaction,
            'assetTypes' => $assetTypes,
            'transactionTypes' => $transactionTypes,
        ]);
    }

    /**
     * Update the transaction.
     */
    public function update(
        UpdateTransactionRequest $request,
        Wallet $wallet,
        Transaction $transaction,
        UpdateTransaction $updateTransaction
    ): RedirectResponse {
        $this->authorize('update', $transaction);

        $updateTransaction->execute(
            transaction: $transaction,
            transactionTypeId: $request->transaction_type_id,
            quantity: $request->quantity,
            unitPrice: $request->unit_price,
            currency: $request->currency,
            tradedAt: $request->traded_at
        );

        return redirect()->route('wallets.transactions.index', $wallet)
            ->with('success', 'Transação atualizada com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        Wallet $wallet,
        Transaction $transaction,
        DeleteTransaction $deleteTransaction
    ) {
        $this->authorize('delete', $transaction);

        $deleteTransaction->execute($transaction);

        return redirect()->route('wallets.transactions.index', $wallet);
    }
}
