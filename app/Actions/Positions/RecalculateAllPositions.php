<?php

namespace App\Actions\Positions;

use App\Models\Wallet;

class RecalculateAllPositions
{
    /**
     * Recalculate all positions for a wallet.
     *
     * @param  bool  $force  Recalculate all, not just dirty ones
     * @return array{recalculated: int, deleted: int, errors: array}
     */
    public function execute(Wallet $wallet, bool $force = false): array
    {
        $query = $wallet->positions();

        if (! $force) {
            $query->dirty();
        }

        $positions = $query->get();

        $results = [
            'recalculated' => 0,
            'deleted' => 0,
            'errors' => [],
        ];

        foreach ($positions as $position) {
            try {
                $result = (new RecalculatePosition)->execute(
                    $wallet,
                    $position->asset_id,
                    $position->custom_asset_id
                );

                if ($result === null) {
                    $results['deleted']++;
                } else {
                    $results['recalculated']++;
                }
            } catch (\Throwable $e) {
                $results['errors'][] = [
                    'position_id' => $position->id,
                    'error' => $e->getMessage(),
                ];
            }
        }

        $wallet->update(['is_dirty' => false]);

        return $results;
    }
}
