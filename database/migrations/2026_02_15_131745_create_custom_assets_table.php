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
        Schema::create('custom_assets', function (Blueprint $table) {
            $table->id();

            $table->foreignId('wallet_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('asset_type_id')
                ->nullable()
                ->constrained('asset_types');

            $table->string('name');
            $table->char('currency', 3);

            $table->timestamps();

            // Unique constraint: same wallet cannot have duplicate custom asset names
            $table->unique(['wallet_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_assets');
    }
};
