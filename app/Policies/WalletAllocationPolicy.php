<?php

namespace App\Policies;

use App\Models\Portfolio;
use App\Models\User;
use App\Models\WalletAllocation;

class WalletAllocationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, WalletAllocation $walletAllocation): bool
    {
        return $walletAllocation->portfolio->wallet->person_id === $user->person_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Portfolio $portfolio): bool
    {
        return $portfolio->wallet->person_id === $user->person_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, WalletAllocation $walletAllocation): bool
    {
        return $walletAllocation->portfolio->wallet->person_id === $user->person_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, WalletAllocation $walletAllocation): bool
    {
        return $walletAllocation->portfolio->wallet->person_id === $user->person_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, WalletAllocation $walletAllocation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, WalletAllocation $walletAllocation): bool
    {
        return false;
    }
}
