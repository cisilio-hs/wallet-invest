<?php

namespace App\Actions\Wallets;

use App\Models\User;
use App\Models\Wallet;

/**
 * Create a new wallet for a user.
 */
class CreateWallet
{
    /**
     * Execute the action.
     *
     * @param User $user
     * @param string $name
     * @return Wallet
     */
    public function execute(User $user, string $name): Wallet
    {
        return Wallet::create([
            'person_id' => $user->person->id,
            'name' => $name,
        ]);
    }
}
