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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('ticker')->unique();
            $table->string('name');

            $table->foreignId('asset_type_id')
                ->constrained('asset_types');

            $table->enum('market', ['BR', 'US', 'GLOBAL']);
            $table->string('currency', 3)->default('BRL'); // ISO 4217

            $table->decimal('minimum_order_quantity', 24, 10)->nullable();
            $table->decimal('minimum_order_value', 15, 6)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
