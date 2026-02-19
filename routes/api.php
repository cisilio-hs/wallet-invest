<?php

use App\Http\Controllers\Api\WalletController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// API routes for Inertia.js - uses web middleware to maintain session
Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::get('/wallets/{wallet}/available-assets', [WalletController::class, 'availableAssets']);
});
