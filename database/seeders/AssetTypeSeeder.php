<?php

namespace Database\Seeders;

use App\Models\AssetType;
use Illuminate\Database\Seeder;

class AssetTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Ação', 'slug' => 'acao'],
            ['name' => 'FII', 'slug' => 'fii'],
            ['name' => 'ETF', 'slug' => 'etf'],
            ['name' => 'Renda Fixa', 'slug' => 'renda-fixa'],
            ['name' => 'Cripto', 'slug' => 'cripto'],
            ['name' => 'Commodities', 'slug' => 'commodity'],
        ];

        foreach ($types as $type) {
            AssetType::create($type);
        }
    }
}
