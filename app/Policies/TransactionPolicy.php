<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;

class TransactionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user, ?Wallet $wallet = null): bool
    {
        if ($wallet === null) {
            return true;
        }

        return $wallet->person_id === $user->person_id;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Transaction $transaction): bool
    {
        return $transaction->wallet->person_id === $user->person_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Wallet $wallet): bool
    {
        return $wallet->person_id === $user->person->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Transaction $transaction): bool
    {
        return $transaction->wallet->person_id === $user->person_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Transaction $transaction): bool
    {
        return $transaction->wallet->person_id === $user->person_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Transaction $transaction): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Transaction $transaction): bool
    {
        return false;
    }
}
