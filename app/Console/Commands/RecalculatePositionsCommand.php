<?php

namespace App\Console\Commands;

use App\Actions\Positions\RecalculateAllPositions;
use App\Actions\Positions\RecalculatePosition;
use App\Models\Wallet;
use Illuminate\Console\Command;

class RecalculatePositionsCommand extends Command
{
    protected $signature = 'positions:recalculate 
                            {wallet_id : The wallet ID}
                            {--asset= : Recalculate specific asset ID}
                            {--custom-asset= : Recalculate specific custom asset ID}
                            {--force : Recalculate all positions, not just dirty ones}';

    protected $description = 'Recalculate positions for a wallet';

    public function handle(): int
    {
        $walletId = (int) $this->argument('wallet_id');
        $assetId = $this->option('asset') ? (int) $this->option('asset') : null;
        $customAssetId = $this->option('custom-asset') ? (int) $this->option('custom-asset') : null;
        $force = $this->option('force');

        $wallet = Wallet::find($walletId);

        if (! $wallet) {
            $this->error("Wallet with ID {$walletId} not found.");

            return Command::FAILURE;
        }

        if ($assetId || $customAssetId) {
            $this->recalculateSingle($wallet, $assetId, $customAssetId);
        } else {
            $this->recalculateAll($wallet, $force);
        }

        return Command::SUCCESS;
    }

    private function recalculateSingle(Wallet $wallet, ?int $assetId, ?int $customAssetId): void
    {
        $this->info("Recalculating position for wallet {$wallet->name} (ID: {$wallet->id})");

        $result = (new RecalculatePosition)->execute($wallet, $assetId, $customAssetId);

        if ($result === null) {
            $this->warn('Position deleted (quantity is 0).');
        } else {
            $this->info('Position recalculated:');
            $this->line("  Quantity: {$result->quantity}");
            $this->line("  Average Price: {$result->average_price}");
            $this->line('  Dirty: '.($result->is_dirty ? 'Yes' : 'No'));
        }
    }

    private function recalculateAll(Wallet $wallet, bool $force): void
    {
        $this->info("Recalculating all positions for wallet {$wallet->name} (ID: {$wallet->id})");

        $results = (new RecalculateAllPositions)->execute($wallet, $force);

        $this->info('Recalculation complete:');
        $this->line("  Positions recalculated: {$results['recalculated']}");
        $this->line("  Positions deleted: {$results['deleted']}");
        $this->line('  Errors: '.count($results['errors']));

        if (! empty($results['errors'])) {
            foreach ($results['errors'] as $error) {
                $this->error("  Position ID {$error['position_id']}: {$error['error']}");
            }
        }
    }
}
