<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Person;
use Illuminate\Support\Facades\Hash;

class InitialUserSeeder extends Seeder
{
    public function run()
    {
        $person = Person::create([
            'id' => 1,
            'name' => 'Admin',
            'phone' => '00000000000',
            'birthday' => '2000-01-01'
        ]);

        User::create([
            'id' => 1,
            'name' => 'Admin',
            'email' => 'admin@local.com',
            'password' => Hash::make('0000'),
            'person_id' => $person->id
        ]);
    }
}
