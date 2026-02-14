# ROADMAP.md - Smart Portfolio Allocator

Complete development roadmap for the Wallet Invest application.

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
  - [x] `app/Actions/Wallets/` - CreateWallet, UpdateWallet, DeleteWallet, ListWallets
  - [x] `app/Actions/Portfolios/` - CreatePortfolio, UpdatePortfolio, DeletePortfolio
  - [x] Controllers moved to `Http/Controllers/Web/`
  - [x] Controllers refactored to use Actions

### Documentation
- [x] **AGENTS.md** - Coding guidelines created
- [x] **Project Purpose** - Documented in AGENTS.md
- [x] **Task Convention** - opencode/tasks/ folder structure

---

## ✅ Phase 1: Portfolio Management (COMPLETED)

- [x] **Portfolio Model** - with target_weight
- [x] **Portfolio Actions** - Create, Update, Delete
- [x] **Portfolio Controller** - Web controller with Actions
- [x] **Portfolio Form** - Create/Edit with percentage input
- [x] **Wallet/Edit Page** - Manage portfolios within wallet

---

## 📋 Phase 2: Wallet Assets with Unlisted Support (IN PROGRESS)

### 2.1 Backend Implementation (COMPLETED)

#### Database Schema ✅
Migration `2026_02_07_195429_create_wallet_assets_table.php` already supports:
- `asset_id` nullable → allows unlisted assets
- `custom_name` text field → stores custom asset names  
- Unique constraint `wallet_id + asset_id + custom_name`

#### Models ✅
- [x] **WalletAsset Model** - Add custom_name to fillable, add accessors
- [x] **Portfolio Model** - Add walletAssets relationship

#### Validation ✅
- [x] **StoreWalletAssetRequest** - Validate asset_id XOR custom_name
- [x] **UpdateWalletAssetRequest** - Update validation rules

#### Actions ✅
- [x] **CreateWalletAsset** - Handle listed vs unlisted logic
- [x] **UpdateWalletAsset** - Support switching types
- [x] **DeleteWalletAsset** - Simple delete

#### Controllers & Routes ✅
- [x] **WalletAssetController** - Full CRUD
- [x] **Routes** - Resource routes for portfolio assets

#### TypeScript Types ✅
- [x] **Update WalletAsset interface** - Add custom_name, display_name, is_listed
- [x] **Update Portfolio interface** - Add wallet_assets relationship

### 2.2 Frontend Implementation (NEXT)

#### Portfolio Management
- [ ] **Portfolio/Edit Page** - Create new page following Wallet Edit pattern
  - [ ] Edit portfolio card (name, target_weight)
  - [ ] Add asset card with form inputs (asset_id/custom_name, quantity, average_price)
  - [ ] Assets list table
- [ ] **Wallet/Edit Update** - Add eye icon to navigate to Portfolio Edit
- [ ] **Routes** - Add portfolio.edit route

#### Asset Management UI
- [ ] **WalletAssetForm Component** - Form for adding/editing assets
  - [ ] Text inputs for all fields (no AssetSelector yet)
  - [ ] Validation display
- [ ] **WalletAssetList Component** - Table showing portfolio assets
  - [ ] Display listed assets (show ticker)
  - [ ] Display unlisted assets (show custom_name)
  - [ ] Edit/Delete actions

---

## 📋 Phase 3: Dashboard & Current State (PLANNED)

### Portfolio Dashboard

#### 3.1 Portfolio Overview Page
**Route:** `/wallet/{wallet}/dashboard`

**Components:**
- `Components/PortfolioAllocationChart.tsx` - Pie chart of current weights
- `Components/TargetVsCurrentBars.tsx` - Progress bars comparing target vs actual
- `Components/PortfolioCard.tsx` - Summary card per portfolio

**Data Displayed:**
- Total wallet value
- Current allocation by portfolio
- Drift from target (absolute and %)
- Number of assets per portfolio

#### 3.2 Asset Distribution View
**Route:** `/portfolio/{portfolio}/assets`

**Components:**
- `Components/AssetScoreTable.tsx` - Table with scores and weights
- `Components/ScoreDistributionChart.tsx` - How scores distribute

**Columns:**
- Ticker/Custom Name
- Current Price × Quantity = Value
- Score (with breakdown)
- Weight % within portfolio
- Buy/Hold/Exclude status

---

## 📋 Phase 4: Recommendation Engine (PLANNED)

### Investment Calculator

#### 4.1 Investment Input Form
**Route:** `/wallet/{wallet}/invest`

**Component:**
- `Pages/Invest/Create.tsx` - Investment amount input

**Fields:**
- Amount to invest (currency input)
- Optional: Maximum single asset allocation

#### 4.2 Calculation Logic
**Service Class:** `InvestmentRecommendationService`

**Steps:**
1. Calculate current portfolio values
2. Determine target values (target_weight × total)
3. Calculate drift (target - current)
4. Sort portfolios by drift (biggest deficit first)
5. For each portfolio:
   - Calculate available allocation
   - Filter assets with score > 0
   - Calculate asset weights by score
   - Determine quantity to buy
   - Handle BR (integer) vs US (fractional)
6. Generate ranked list

#### 4.3 Recommendation Display
**Component:**
- `Components/RecommendationList.tsx` - Ranked suggestions
- `Components/RecommendationCard.tsx` - Single suggestion details

**Display Info:**
- Asset ticker and name
- Current price
- Recommended quantity
- Total cost
- % of portfolio after purchase
- Score breakdown

#### 4.4 Logic Constraints
- BR assets (B3): integer shares only
- US assets (NASDAQ/NYSE): fractional allowed
- Exclude assets with score ≤ 0
- Respect target weights (don't over-allocate)

---

## 📋 Phase 5: Polish & Future Features (PLANNED)

### 5.1 UI/UX Improvements
- [ ] Dark mode support
- [ ] Mobile-responsive improvements
- [ ] Loading states and skeletons
- [ ] Error boundaries
- [ ] Toast notifications

### 5.2 Price Integration (Future)
- [ ] GoogleFinance API integration
- [ ] Automated price updates
- [ ] Price history tracking
- [ ] Price alerts

### 5.3 Transaction History (Future)
- [ ] `transactions` table
- [ ] Track buy/sell operations
- [ ] Average price calculation (FIFO)
- [ ] Profit/Loss tracking

### 5.4 Reports & Analytics
- [ ] Portfolio performance over time
- [ ] Asset performance comparison
- [ ] Rebalancing history
- [ ] Tax reporting helpers

### 5.5 Multi-User Features (Future)
- [ ] Shared portfolios
- [ ] Read-only access
- [ ] Portfolio templates

---

## 🎯 Current Priority

**Next Step:** Phase 2.2 - Frontend Implementation

**Focus:**
1. Create Portfolio/Edit page with full asset management
2. Update Wallet/Edit to add navigation to Portfolio Edit
3. Create WalletAssetForm and WalletAssetList components
4. Test listed vs unlisted asset creation

---

## 📊 Progress Tracker

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 0: Foundation | ✅ Complete | 100% |
| Phase 1: Portfolio | ✅ Complete | 100% |
| Phase 2.1: Backend | ✅ Complete | 100% |
| Phase 2.2: Frontend | 🚧 In Progress | 0% |
| Phase 3: Dashboard | 📋 Planned | 0% |
| Phase 4: Recommendation Engine | 📋 Planned | 0% |
| Phase 5: Polish & Future | 📋 Planned | 0% |

---

## 📝 Notes

- All prices are manually entered (Phase 1-5)
- No transaction history (current quantity only)
- GoogleFinance integration planned for future phase
- Focus: Current state management + buy recommendations
