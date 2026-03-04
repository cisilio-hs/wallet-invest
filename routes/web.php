<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\CustomAssetController;
use App\Http\Controllers\Web\PortfolioController;
use App\Http\Controllers\Web\PositionController;
use App\Http\Controllers\Web\TransactionController;
use App\Http\Controllers\Web\WalletAllocationController;
use App\Http\Controllers\Web\WalletController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::resource('wallets', WalletController::class);
    Route::resource('portfolios', PortfolioController::class);
    Route::resource('wallet-allocations', WalletAllocationController::class)->only(['store', 'update', 'destroy']);
    Route::resource('custom-assets', CustomAssetController::class);

    // Transactions aninhadas em wallet (shallow resource)
    Route::resource('wallets.transactions', TransactionController::class)->scoped();

    // Positions aninhadas em wallet
    Route::get('/wallets/{wallet}/positions', [PositionController::class, 'index'])
        ->name('wallets.positions.index');
    Route::get('/wallets/{wallet}/positions/{position}', [PositionController::class, 'show'])
        ->name('wallets.positions.show');
    Route::post('/wallets/{wallet}/positions/{position}/recalculate', [PositionController::class, 'recalculate'])
        ->name('wallets.positions.recalculate');
    Route::post('/wallets/{wallet}/positions/recalculate-all', [PositionController::class, 'recalculateAll'])
        ->name('wallets.positions.recalculateAll');
});

require __DIR__.'/auth.php';
