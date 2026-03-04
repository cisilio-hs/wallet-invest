<?php

namespace App\Console\Commands;

use App\Actions\Positions\RecalculateAllPositions;
use App\Models\Wallet;
use Illuminate\Console\Command;

class RecalculateWalletCommand extends Command
{
    protected $signature = 'wallet:recalculate 
                            {wallet_id? : The wallet ID (optional - recalculates all if not provided)}
                            {--force : Recalculate all positions, not just dirty ones}';

    protected $description = 'Recalculate positions for a wallet or all wallets';

    public function handle(): int
    {
        $walletId = $this->argument('wallet_id');
        $force = $this->option('force');

        if ($walletId) {
            return $this->recalculateSingleWallet((int) $walletId, $force);
        }

        return $this->recalculateAllWallets($force);
    }

    private function recalculateSingleWallet(int $walletId, bool $force): int
    {
        $wallet = Wallet::find($walletId);

        if (! $wallet) {
            $this->error("Wallet with ID {$walletId} not found.");

            return Command::FAILURE;
        }

        $this->info("Recalculating positions for wallet: {$wallet->name} (ID: {$wallet->id})");

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

        return Command::SUCCESS;
    }

    private function recalculateAllWallets(bool $force): int
    {
        $wallets = Wallet::all();

        if ($wallets->isEmpty()) {
            $this->warn('No wallets found.');

            return Command::SUCCESS;
        }

        $this->info('Recalculating positions for all wallets...');

        $totalRecalculated = 0;
        $totalDeleted = 0;
        $totalErrors = 0;

        foreach ($wallets as $wallet) {
            $this->line("Processing wallet: {$wallet->name} (ID: {$wallet->id})");

            $results = (new RecalculateAllPositions)->execute($wallet, $force);

            $totalRecalculated += $results['recalculated'];
            $totalDeleted += $results['deleted'];
            $totalErrors += count($results['errors']);

            $this->line("  Recalculated: {$results['recalculated']}, Deleted: {$results['deleted']}");
        }

        $this->info('All wallets recalculation complete:');
        $this->line("  Total positions recalculated: {$totalRecalculated}");
        $this->line("  Total positions deleted: {$totalDeleted}");
        $this->line("  Total errors: {$totalErrors}");

        return Command::SUCCESS;
    }
}
