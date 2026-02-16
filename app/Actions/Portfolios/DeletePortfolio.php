<?php

namespace App\Actions\Portfolios;

use App\Models\Portfolio;

/**
 * Delete a portfolio.
 */
class DeletePortfolio
{
    /**
     * Execute the action.
     */
    public function execute(Portfolio $portfolio): bool
    {
        return $portfolio->delete();
    }
}
