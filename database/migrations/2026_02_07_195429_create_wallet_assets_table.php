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
        Schema::create('wallet_assets', function (Blueprint $table) {
            $table->id();

            $table->foreignId('wallet_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('portfolio_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('asset_id')
                ->constrained()
                ->cascadeOnDelete()
                ->nullable();

            $table->string('custom_name')->nullable();
            $table->unsignedInteger('score')->default(0);
            $table->decimal('quantity', 24, 10);
            $table->decimal('average_price', 15, 6);
            $table->timestamps();

            $table->unique(['wallet_id', 'asset_id', 'custom_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_assets');
    }
};
