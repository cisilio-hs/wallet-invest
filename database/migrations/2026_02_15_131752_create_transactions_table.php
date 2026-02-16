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
        Schema::create('transactions', function (Blueprint $table) {
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

            $table->decimal('quantity', 24, 10);
            $table->decimal('unit_price', 15, 6);
            $table->decimal('gross_amount', 20, 6);
            $table->char('currency', 3);
            $table->dateTime('traded_at');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
