<?php

namespace App\Actions\Wallets;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Collection;

/**
 * List all wallets for a user.
 */
class ListWallets
{
    /**
     * Execute the action.
     *
     * @param User $user
     * @return Collection<int, Wallet>
     */
    public function execute(User $user): Collection
    {
        return Wallet::where('person_id', $user->person->id)
            ->with('portfolios')
            ->get();
    }
}
