<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransactionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            // Positive quantity (increase position)
            [
                'name' => 'Compra',
                'slug' => 'buy',
                'description' => 'Compra de ativo',
                'quantity_sign' => 'positive',
                'is_active' => true,
            ],
            [
                'name' => 'Bonificação',
                'slug' => 'bonus',
                'description' => 'Bonificação de ativos',
                'quantity_sign' => 'positive',
                'is_active' => true,
            ],
            [
                'name' => 'Desmembramento',
                'slug' => 'split',
                'description' => 'Desmembramento/Split',
                'quantity_sign' => 'positive',
                'is_active' => true,
            ],
            
            // Negative quantity (decrease position)
            [
                'name' => 'Venda',
                'slug' => 'sell',
                'description' => 'Venda de ativo',
                'quantity_sign' => 'negative',
                'is_active' => true,
            ],
            [
                'name' => 'Grupamento',
                'slug' => 'reverse_split',
                'description' => 'Grupamento/Reverse Split',
                'quantity_sign' => 'negative',
                'is_active' => true,
            ],
            
            // Neutral (no quantity change, only value)
            [
                'name' => 'Dividendo',
                'slug' => 'dividend',
                'description' => 'Dividendo',
                'quantity_sign' => 'neutral',
                'is_active' => true,
            ],
            [
                'name' => 'JCP',
                'slug' => 'jcp',
                'description' => 'Juros sobre Capital Próprio',
                'quantity_sign' => 'neutral',
                'is_active' => true,
            ],
        ];

        foreach ($types as $type) {
            DB::table('transaction_types')->insert(array_merge($type, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
