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
        Schema::table('assets', function (Blueprint $table) {
            $table->index('ticker', 'idx_assets_ticker');
            $table->index('name', 'idx_assets_name');
        });

        Schema::table('custom_assets', function (Blueprint $table) {
            $table->index('name', 'idx_custom_assets_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropIndex('idx_assets_ticker');
            $table->dropIndex('idx_assets_name');
        });

        Schema::table('custom_assets', function (Blueprint $table) {
            $table->dropIndex('idx_custom_assets_name');
        });
    }
};
