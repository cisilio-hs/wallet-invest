<?php

namespace App\Actions\Portfolios;

use App\Models\Portfolio;

/**
 * Update an existing portfolio.
 */
class UpdatePortfolio
{
    /**
     * Execute the action.
     *
     * @param Portfolio $portfolio
     * @param array<string, mixed> $data
     * @return Portfolio
     */
    public function execute(Portfolio $portfolio, array $data): Portfolio
    {
        $portfolio->update($data);
        return $portfolio->fresh();
    }
}
