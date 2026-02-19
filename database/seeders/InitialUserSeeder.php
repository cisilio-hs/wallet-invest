<?php

namespace Database\Seeders;

use App\Models\Person;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InitialUserSeeder extends Seeder
{
    public function run()
    {
        $person = Person::create([
            'id' => 1,
            'name' => 'Admin',
            'phone' => '00000000000',
            'birthday' => '2000-01-01',
        ]);

        User::create([
            'id' => 1,
            'name' => 'Admin',
            'email' => 'admin@local.com',
            'password' => Hash::make('0'),
            'person_id' => $person->id,
        ]);
    }
}
