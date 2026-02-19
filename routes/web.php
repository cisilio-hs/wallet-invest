<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\CustomAssetController;
use App\Http\Controllers\Web\PortfolioController;
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
});

require __DIR__.'/auth.php';
