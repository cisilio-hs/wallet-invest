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
     *
     * @param Portfolio $portfolio
     * @return bool
     */
    public function execute(Portfolio $portfolio): bool
    {
        return $portfolio->delete();
    }
}
