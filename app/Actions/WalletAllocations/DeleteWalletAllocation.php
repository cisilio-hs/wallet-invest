<?php

namespace App\Actions\WalletAllocations;

use App\Models\WalletAllocation;

class DeleteWalletAllocation
{
    /**
     * Delete a wallet allocation.
     */
    public function execute(WalletAllocation $walletAllocation): void
    {
        $walletAllocation->delete();
    }
}
