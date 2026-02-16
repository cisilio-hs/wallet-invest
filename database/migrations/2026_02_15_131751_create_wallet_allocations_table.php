<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wallet_allocations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('wallet_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('portfolio_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('asset_id')
                ->nullable()
                ->constrained('assets')
                ->cascadeOnDelete();

            $table->foreignId('custom_asset_id')
                ->nullable()
                ->constrained('custom_assets')
                ->cascadeOnDelete();

            $table->unsignedInteger('score')->default(0);

            $table->timestamps();

            // Unique constraint: one allocation per wallet/portfolio/asset combination
            $table->unique(['wallet_id', 'portfolio_id', 'asset_id', 'custom_asset_id'], 'unique_allocation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_allocations');
    }
};
