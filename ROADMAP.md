# ROADMAP.md - Smart Portfolio Allocator

Complete development roadmap for the Wallet Invest application using **Transactions-Based Architecture**.

## Architecture Overview

```
transactions (source of truth)
        ↓
positions (projection/cache)
        ↓
dashboard / recommendation

wallet_allocations (strategy layer)
```

### Core Principles
- **Transactions** = Source of truth (all buy/sell operations)
- **Positions** = Projection/cache for fast reads (auto-calculated from transactions)
- **Wallet Allocations** = User-defined strategy layer (scoring, weights)
- **Custom Assets** = Unlisted assets (Gold, CDBs, etc.) separate from global catalog

---

## ✅ Phase 0: Foundation (COMPLETED)

### Infrastructure Setup
- [x] **Docker Environment** - PHP 8.5, MySQL, Node.js containers
- [x] **Laravel Installation** - Laravel 12 with Breeze (React/Inertia)
- [x] **Authentication** - Login, Register, Password reset
- [x] **Person Model** - Identity management separate from User
- [x] **Base Models** - Wallet, Portfolio, Asset, AssetType

### Code Quality
- [x] **TypeScript Migration** - All JSX → TSX
- [x] **PHP 8.5 Update** - composer.json updated
- [x] **Model Docblocks** - PHPDoc annotations on all models
- [x] **Type Definitions** - Full TypeScript interfaces
- [x] **Testing Setup** - Pest configured
- [x] **Linting** - Laravel Pint configured
- [x] **Action Layer** - Business logic separated for API/Mobile readiness
- [x] **Documentation** - AGENTS.md, task files

---

## ✅ Phase 1: Portfolio Management (COMPLETED)

- [x] **Portfolio Model** - with target_weight
- [x] **Portfolio Actions** - Create, Update, Delete
- [x] **Portfolio Controller** - Web controller with Actions
- [x] **Wallet/Edit Page** - Manage portfolios within wallet

---

## ✅ Phase 2: Transactions-Based Architecture (COMPLETED)

### Overview
Replace direct wallet_assets approach with transactions-based ledger system.

### 2.1 Database Schema

#### Updated Tables:

**assets** - Global listed assets (updated with order constraints)
- `id`, `ticker`, `name`, `asset_type_id`, `market`, `currency`
- **NEW:** `minimum_order_quantity` - Minimum quantity per order (e.g., 1 for BR stocks, 0.0001 for crypto)
- **NEW:** `minimum_order_value` - Minimum value per order (e.g., $1 for fractional shares)

#### New Tables Required:

**custom_assets** - Unlisted assets (per wallet)
- `id`, `wallet_id`, `name`, `asset_type_id`, `currency`

**wallet_allocations** - Strategy layer (scoring)
- `id`, `wallet_id`, `portfolio_id`, `asset_id`, `custom_asset_id`, `score`

**transactions** - Ledger (source of truth)
- `id`, `wallet_id`, `asset_id`, `custom_asset_id`, `quantity`, `unit_price`, `gross_amount`, `currency`, `traded_at`
- Quantity is signed: BUY = positive, SELL = negative

**positions** - Projection/cache
- `id`, `wallet_id`, `asset_id`, `custom_asset_id`, `quantity`, `average_price`, `is_dirty`

### 2.2 Implementation Steps

#### Step 1: Custom Assets
- [x] Migration: Create `custom_assets` table
- [x] Model: CustomAsset with relationships
- [x] Actions: CreateCustomAsset, UpdateCustomAsset, DeleteCustomAsset
- [x] Controller: CustomAssetController
- [x] Frontend: CustomAsset management UI

#### Step 2: Wallet Allocations
- [x] Migration: Create `wallet_allocations` table
- [x] Model: WalletAllocation with validation (asset_id XOR custom_asset_id)
- [x] Actions: CRUD for allocations with scoring
- [x] Controller: WalletAllocationController
- [x] Frontend: Allocation management with score input

#### Step 3: Transactions (Ledger)
- [x] Migration: Create `transactions` table
- [x] Model: Transaction with computed type attribute
- [x] Actions: RecordTransaction, DeleteTransaction
- [x] Validation: Transaction rules (quantity signed, etc.)
- [x] Controller: TransactionController
- [x] Frontend: Transaction entry form

#### Step 4: Positions (Projection)
- [x] Migration: Create `positions` table
- [x] Model: Position with is_dirty flag
- [x] Actions: RecalculatePosition, RecalculateAllPositions
- [x] Console Commands: positions:recalculate, wallet:recalculate
- [x] Frontend: Position/Index, Position/Show

#### Step 5: Integration
- [x] Wallet.is_dirty flag
- [x] Auto-mark positions dirty on new transaction
- [x] Dashboard uses positions (fast read) - pending final unification

### 2.3 Migration from Old System
- [ ] Migrate existing wallet_assets → transactions
- [ ] Create initial position records
- [ ] Deprecate wallet_assets table (keep for reference)

---

## 📋 Phase 3: Dashboard & Current State

### 3.1 Portfolio Dashboard
**Route:** `/wallet/{wallet}/dashboard`

**Data Source:** positions (cached projection)

**Components:**
- Portfolio allocation pie chart
- Target vs Current weight bars
- Asset list with quantities and values
- Last consolidation timestamp

### 3.2 Asset Management
**Route:** `/wallet/{wallet}/assets`

**Features:**
- View all positions
- See transaction history per asset
- Manual price update (for unlisted)

---

## 📋 Phase 4: Recommendation Engine

### 4.1 Investment Input
**Route:** `/wallet/{wallet}/invest`

**Inputs:**
- Available capital
- Maximum single asset allocation (optional)

**Data Sources:**
- positions (current state)
- wallet_allocations (strategy)
- current prices

### 4.2 Calculation Logic
1. Get current positions
2. Get allocation strategy (scores, target weights)
3. Calculate current weights
4. Calculate drift from target
5. Rank by priority (under-allocated first)
6. Within portfolio, distribute by score
7. Generate buy suggestions

### 4.3 Output
- Ranked list of suggestions
- Quantity to buy (integer BR, fractional US)
- Estimated cost
- New allocation %

---

## 📋 Phase 5: Polish & Future Features

### 5.1 UI/UX
- [ ] Dark mode
- [ ] Mobile responsive
- [ ] Loading states
- [ ] Toast notifications

### 5.2 Price Integration
- [ ] GoogleFinance API for listed assets
- [ ] Manual price entry for unlisted
- [ ] Price history tracking

### 5.3 Advanced Features
- [ ] FIFO/LIFO toggle
- [ ] Tax reporting (profit/loss)
- [ ] Rebalancing history
- [ ] Portfolio sharing

---

## 🎯 Current Priority

**Phase 3: Dashboard & Current State**

**Start with:** Unified Dashboard showing positions, allocations, and sync status

1. Create Dashboard page with position overview
2. Add sync status banner (is_dirty)
3. Integrate wallet_allocations for scoring
4. Show target vs current allocation

---

## 📊 Progress Tracker

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 0: Foundation | ✅ Complete | 100% |
| Phase 1: Portfolio | ✅ Complete | 100% |
| Phase 2: Transactions Arch | ✅ Complete | 100% |
| Phase 3: Dashboard | 📋 Planned | 0% |
| Phase 4: Recommendation | 📋 Planned | 0% |
| Phase 5: Polish | 📋 Planned | 0% |

---

## 📝 Architecture Notes

### Why Transactions-Based?
- **Audit Trail:** Complete history of all operations
- **Flexibility:** Can recalculate positions with different rules (FIFO/LIFO)
- **Accuracy:** Source of truth vs calculated projections
- **Future-Proof:** Easy to add features like cost basis, tax reporting

### Key Differences from Old Approach
- ❌ Old: Direct wallet_assets table
- ✅ New: Transactions → Positions (projection)
- ❌ Old: Score in wallet_assets
- ✅ New: Score in wallet_allocations (strategy layer)
- ❌ Old: Unlisted assets in same table
- ✅ New: Separate custom_assets table

### Consolidation Strategy
- Positions recalculated on-demand or scheduled
- is_dirty flag marks stale data
- Fast dashboard reads from positions
- Complex logic in allocation/recommendation layer
