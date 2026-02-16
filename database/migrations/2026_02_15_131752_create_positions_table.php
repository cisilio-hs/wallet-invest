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
        Schema::create('positions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('wallet_id')
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

            $table->decimal('quantity', 24, 10)->default(0);
            $table->decimal('average_price', 15, 6)->default(0);
            $table->boolean('is_dirty')->default(false);

            $table->timestamps();

            // Unique constraint: one position per wallet/asset combination
            $table->unique(['wallet_id', 'asset_id', 'custom_asset_id'], 'unique_position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};
