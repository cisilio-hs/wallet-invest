<?php

namespace App\Policies;

use App\Models\Portfolio;
use App\Models\User;
use App\Models\Wallet;

class PortfolioPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Portfolio $portfolio): bool
    {
        return false;
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
    public function update(User $user, Portfolio $portfolio): bool
    {
        return $portfolio->wallet->person_id === $user->person->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Portfolio $portfolio): bool
    {
        return $portfolio->wallet->person_id === $user->person->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Portfolio $portfolio): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Portfolio $portfolio): bool
    {
        return false;
    }
}
