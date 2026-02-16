# Transactions-Based Architecture Implementation

**Date:** 2026-02-13  
**Status:** Ready for Implementation  
**Priority:** HIGH  
**Replaces:** 2026_02_12_230836_WALLET_ASSETS_UNLISTED_SUPPORT.md [ABORTED]

---

## Executive Summary

Implement a transactions-based ledger system as the core architecture for Wallet Invest.

**Architecture:**
```
transactions (source of truth)
        ↓
positions (projection/cache)
        ↓
dashboard / recommendation

wallet_allocations (strategy layer)
```

---

## Database Schema

### Updated Tables

**assets** (global listed assets)
```sql
id: bigint PK
ticker: string unique
name: string
asset_type_id: FK → asset_types
market: enum ['BR', 'US', 'GLOBAL']
currency: char(3)
minimum_order_quantity: decimal(24,10) nullable  ← NEW
minimum_order_value: decimal(15,6) nullable      ← NEW
created_at: timestamp
updated_at: timestamp
```

**Note:** Added order constraint fields for recommendation engine.

### Table: custom_assets
```sql
id: bigint PK
wallet_id: FK → wallets
asset_type_id: FK → asset_types (nullable)
name: string
currency: char(3)
created_at: timestamp
updated_at: timestamp
```

**Note:** `asset_type_id` references global `asset_types` table (optional categorization).

### Table: wallet_allocations
```sql
id: bigint PK
wallet_id: FK → wallets
portfolio_id: FK → portfolios
asset_id: FK → assets (nullable)
custom_asset_id: FK → custom_assets (nullable)
score: unsignedInteger default 0
created_at: timestamp
updated_at: timestamp

UNIQUE(wallet_id, portfolio_id, asset_id, custom_asset_id)
```

**Constraint:** XOR - either asset_id OR custom_asset_id must be set, not both.

### Table: transactions
```sql
id: bigint PK
wallet_id: FK → wallets
asset_id: FK → assets (nullable)
custom_asset_id: FK → custom_assets (nullable)
quantity: decimal(24,10) signed
unit_price: decimal(15,6)
gross_amount: decimal(20,6) signed
currency: char(3)
trading_date: datetime
notes: text (optional)
created_at: timestamp
updated_at: timestamp
```

**Rules:**
- quantity > 0 = BUY
- quantity < 0 = SELL
- gross_amount = quantity × unit_price

### Table: positions
```sql
id: bigint PK
wallet_id: FK → wallets
asset_id: FK → assets (nullable)
custom_asset_id: FK → custom_assets (nullable)
quantity: decimal(24,10)
average_price: decimal(15,6)
is_dirty: boolean default false
created_at: timestamp
updated_at: timestamp

UNIQUE(wallet_id, asset_id, custom_asset_id)
```

---

## Implementation Order

### Step 1: Database Migrations

Create migrations for new tables:
- [ ] `custom_assets` table
- [ ] `wallet_allocations` table  
- [ ] `transactions` table
- [ ] `positions` table
- [ ] Update `wallets` table (add is_dirty field)
- [ ] Update/delete old `wallet_assets` migration

**Command:** `docker-compose exec app php artisan migrate:fresh`

---

### Step 2: Models

Update/create models with relationships and validation:
- [ ] **CustomAsset** model
  - Relationships: wallet, assetType, transactions, positions
  - Validation: name required, currency required
- [ ] **WalletAllocation** model
  - Relationships: wallet, portfolio, asset, customAsset
  - Validation: XOR asset_id/custom_asset_id
- [ ] **Transaction** model
  - Relationships: wallet, asset, customAsset
  - Accessor: getTypeAttribute() (buy/sell)
  - Boot: validate XOR, calculate gross_amount
- [ ] **Position** model
  - Relationships: wallet, asset, customAsset
- [ ] **Wallet** model (update)
  - Add is_dirty field
  - Relationship: positions

---

### Step 3: Custom Assets CRUD

Complete CRUD for unlisted assets:

#### 3.1 Actions
- [ ] CreateCustomAsset
- [ ] UpdateCustomAsset
- [ ] DeleteCustomAsset (check for transactions first)
- [ ] ListCustomAssets

#### 3.2 Validation
- [ ] StoreCustomAssetRequest
- [ ] UpdateCustomAssetRequest

#### 3.3 Controller
- [ ] CustomAssetController

#### 3.4 Routes
- [ ] Resource routes for custom-assets

#### 3.5 Frontend
- [ ] CustomAssets/Index page
- [ ] CustomAssets/Create form
- [ ] CustomAssets/Edit form

---

### Step 4: Transactions CRUD

Complete CRUD for transaction ledger:

#### 4.1 Actions
- [ ] RecordTransaction
  - Validate asset exists (listed or custom)
  - Calculate gross_amount
  - Mark position as dirty
  - Mark wallet as dirty
- [ ] DeleteTransaction
- [ ] ListTransactions (filterable)

#### 4.2 Validation
- [ ] StoreTransactionRequest
  - quantity ≠ 0
  - unit_price > 0
  - trading_date not in future

#### 4.3 Controller
- [ ] TransactionController

#### 4.4 Routes
- [ ] Resource routes for transactions

#### 4.5 Frontend
- [ ] Transaction entry form
- [ ] Transaction history page

---

### Step 5: Position Consolidation Service

Create service to calculate positions from transactions:

#### 5.1 Service: PositionConsolidationService

```php
class PositionConsolidationService
{
    public function consolidateWallet(Wallet $wallet): void
    {
        // Only consolidate dirty positions
        $dirtyPositions = $wallet->positions()->where('is_dirty', true)->get();
        
        foreach ($dirtyPositions as $position) {
            $this->consolidatePosition($position);
        }
        
        // Clear wallet dirty flag if no more dirty positions
        $hasDirty = $wallet->positions()->where('is_dirty', true)->exists();
        if (!$hasDirty) {
            $wallet->update(['is_dirty' => false]);
        }
    }
    
    private function consolidatePosition(Position $position): void
    {
        $transactions = Transaction::where('wallet_id', $position->wallet_id)
            ->when($position->asset_id, fn($q) => $q->where('asset_id', $position->asset_id))
            ->when($position->custom_asset_id, fn($q) => $q->where('custom_asset_id', $position->custom_asset_id))
            ->orderBy('trading_date')
            ->orderBy('created_at')
            ->get();
        
        $quantity = $transactions->sum('quantity');
        $averagePrice = $this->calculateAveragePriceFIFO($transactions);
        
        $position->update([
            'quantity' => $quantity,
            'average_price' => $averagePrice,
            'is_dirty' => false,
        ]);
    }
    
    private function calculateAveragePriceFIFO($transactions): float
    {
        $totalCost = 0;
        $totalQuantity = 0;
        $buyQueue = [];
        
        foreach ($transactions as $tx) {
            if ($tx->quantity > 0) {
                // BUY
                $buyQueue[] = [
                    'quantity' => $tx->quantity,
                    'price' => $tx->unit_price
                ];
                $totalCost += $tx->gross_amount;
                $totalQuantity += $tx->quantity;
            } else {
                // SELL - consume from queue
                $sellQuantity = abs($tx->quantity);
                while ($sellQuantity > 0 && !empty($buyQueue)) {
                    $buy = &$buyQueue[0];
                    $consume = min($buy['quantity'], $sellQuantity);
                    
                    $buy['quantity'] -= $consume;
                    $sellQuantity -= $consume;
                    $totalCost -= $consume * $buy['price'];
                    $totalQuantity -= $consume;
                    
                    if ($buy['quantity'] <= 0) {
                        array_shift($buyQueue);
                    }
                }
            }
        }
        
        return $totalQuantity > 0 ? $totalCost / $totalQuantity : 0;
    }
}
```

#### 5.2 Command
- [ ] Artisan command: `positions:consolidate {wallet_id?}`

#### 5.3 Auto-Consolidation
- [ ] After transaction created: mark position dirty
- [ ] After transaction deleted: mark position dirty
- [ ] Queue job for async consolidation

---

### Step 6: Wallet Allocations (Strategy)

CRUD for strategy layer:

#### 6.1 Actions
- [ ] CreateWalletAllocation
- [ ] UpdateWalletAllocation (change score, portfolio)
- [ ] DeleteWalletAllocation
- [ ] ListWalletAllocations

#### 6.2 Validation
- [ ] StoreWalletAllocationRequest (enforce XOR)
- [ ] UpdateWalletAllocationRequest

#### 6.3 Controller
- [ ] WalletAllocationController

#### 6.4 Routes
- [ ] Resource routes for allocations

#### 6.5 Frontend
- [ ] Allocation manager page
- [ ] Score input component
- [ ] Asset selector (listed + custom)

---

### Step 7: Dashboard Integration

#### 7.1 Controller
- [ ] Check wallet.is_dirty
- [ ] Load positions for display
- [ ] Show consolidation status

#### 7.2 UI
- [ ] Position list (asset, quantity, avg price)
- [ ] "Refresh" button to trigger consolidation
- [ ] Visual indicator for dirty data
- [ ] Last consolidation timestamp

---

## Notes

### No Migration Script Needed
Since the system doesn't exist yet (no real users/data), we don't need a migration script. We'll use:
```bash
docker-compose exec app php artisan migrate:fresh
```

The old `wallet_assets` table concept is replaced by:
- `wallet_allocations` (strategy layer with score)
- `transactions` (ledger)
- `positions` (calculated cache)

### is_dirty Logic
- Wallet has is_dirty flag
- Each position has is_dirty flag
- When transaction is created/deleted: position.is_dirty = true, wallet.is_dirty = true
- Consolidation only processes positions where is_dirty = true
- After consolidation: position.is_dirty = false
- When all positions clean: wallet.is_dirty = false

---

## Success Criteria

1. ✅ Users can create custom assets (Gold, CDBs, etc.)
2. ✅ Users can record buy/sell transactions
3. ✅ Positions calculate correctly from transactions (FIFO)
4. ✅ Only dirty positions are re-consolidated
5. ✅ Allocations define strategy (scores, portfolios)
6. ✅ Dashboard shows consolidated positions
7. ✅ Performance: Dashboard loads < 500ms

---

## Timeline Estimate

| Step | Duration |
|------|----------|
| Step 1: Migrations | 1 day |
| Step 2: Models | 1 day |
| Step 3: Custom Assets CRUD | 2 days |
| Step 4: Transactions CRUD | 2 days |
| Step 5: Position Consolidation | 2 days |
| Step 6: Allocations | 2 days |
| Step 7: Dashboard | 2 days |
| Testing & Polish | 2 days |
| **Total** | **~14 days** |

---

## Next Actions

1. Create all migrations (Step 1)
2. Run `migrate:fresh` to set up database
3. Create models with relationships (Step 2)
4. Begin Custom Assets CRUD (Step 3)

---

## References

- DatabaseStructurePlan.md - Schema documentation
- ROADMAP.md - Project roadmap
- AGENTS.md - Development guidelines
