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

## 📋 Phase 1: Portfolio & Scoring Foundation (PLANNED)

### Database Schema

#### 1.1 Create `portfolios` table
**Fields:**
- `id` - bigint, primary key
- `wallet_id` - bigint, foreign key → wallets
- `name` - string (e.g., "FIIs-tijolo", "Internacional")
- `target_weight` - decimal(5,2) (percentage, e.g., 25.00)
- `timestamps`

**Relationships:**
- Portfolio belongsTo Wallet
- Portfolio hasMany ScoringQuestion
- Portfolio hasMany Asset

#### 1.2 Create `scoring_questions` table
**Fields:**
- `id` - bigint, primary key
- `portfolio_id` - bigint, foreign key → portfolios
- `question_text` - text (e.g., "DY >= 8%?")
- `sort_order` - integer (for ordering questions)
- `timestamps`

**Relationships:**
- ScoringQuestion belongsTo Portfolio

#### 1.3 Update `assets` table
**New Fields:**
- `portfolio_id` - bigint, foreign key → portfolios
- `asset_type` - enum: 'stock', 'fii', 'bond', 'crypto', 'reit'
- Change `ticker` unique constraint to: `wallet_id + ticker`

**Remove/Update:**
- Remove `asset_type_id` (replace with enum)
- Remove `wallet_id` foreign key from assets (moved to portfolios)

**Relationships:**
- Asset belongsTo Portfolio
- Asset hasMany ScoringAnswer

#### 1.4 Create `scoring_answers` table
**Fields:**
- `id` - bigint, primary key
- `asset_id` - bigint, foreign key → assets
- `scoring_question_id` - bigint, foreign key → scoring_questions
- `answer` - boolean (true = +1, false = -1)
- `timestamps`

**Relationships:**
- ScoringAnswer belongsTo Asset
- ScoringAnswer belongsTo ScoringQuestion

### Models

#### 1.5 Create Portfolio Model
**Methods:**
- `wallet()` - belongsTo
- `scoringQuestions()` - hasMany
- `assets()` - hasMany
- `calculateTotalScore()` - sum of all asset scores
- `calculateAssetWeights()` - array of asset_id => weight%

#### 1.6 Update Asset Model
**New Relationships:**
- `portfolio()` - belongsTo
- `scoringAnswers()` - hasMany

**New Methods:**
- `calculateScore()` - sum of scoring answers
- `isBuyable()` - score > 0

#### 1.7 Create ScoringQuestion Model
**Methods:**
- `portfolio()` - belongsTo
- `scoringAnswers()` - hasMany

#### 1.8 Create ScoringAnswer Model
**Methods:**
- `asset()` - belongsTo
- `scoringQuestion()` - belongsTo

### Controllers

#### 1.9 PortfolioController
**Methods:**
- `index()` - List portfolios in wallet
- `create()` - Show create form
- `store()` - Create new portfolio
- `edit()` - Show edit form
- `update()` - Update portfolio
- `destroy()` - Delete portfolio

#### 1.10 ScoringQuestionController
**Methods:**
- `index(Portfolio $portfolio)` - List questions
- `store(Portfolio $portfolio)` - Add question
- `update(ScoringQuestion $question)` - Edit question
- `destroy(ScoringQuestion $question)` - Delete question

### Frontend Components

#### 1.11 Portfolio Management Pages
- `Pages/Portfolio/Index.tsx` - List portfolios with target weights
- `Pages/Portfolio/Create.tsx` - Create portfolio form
- `Pages/Portfolio/Edit.tsx` - Edit portfolio form

#### 1.12 Scoring Questions UI
- `Components/ScoringQuestionManager.tsx` - CRUD for questions
- `Components/QuestionForm.tsx` - Add/edit question form

---

## 📋 Phase 2: Asset Management (PLANNED)

### Database & Models

#### 2.1 Asset CRUD
**Backend:**
- AssetController with full CRUD
- Form requests for validation

**Frontend:**
- `Pages/Asset/Index.tsx` - List assets in portfolio
- `Pages/Asset/Create.tsx` - Add new asset
- `Pages/Asset/Edit.tsx` - Edit asset (price, quantity)

#### 2.2 Asset Form Fields
- Ticker (unique per wallet)
- Asset Type (dropdown: stock, fii, bond, crypto, reit)
- Name (optional display name)
- Current Price (manual entry)
- Quantity (current holding)

### Scoring Answers

#### 2.3 Answer Scoring Questions
**Component:**
- `Components/AssetScoringForm.tsx` - Answer all questions for asset
- Display score calculation in real-time

**Logic:**
- Load all questions from asset's portfolio
- Show Yes/No toggle for each
- Calculate and display total score

#### 2.4 Score Display
**Component:**
- `Components/AssetScoreBadge.tsx` - Visual score indicator
- Color coding: Green (>0), Gray (0), Red (<0)

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
- Ticker
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

**Next Step:** Phase 1 - Portfolio & Scoring Foundation

**Focus:**
1. Database migrations (portfolios, scoring_questions, scoring_answers)
2. Update assets table structure
3. Create models with relationships
4. Basic CRUD for Portfolios
5. Scoring Questions management

---

## 📊 Progress Tracker

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 0: Foundation | ✅ Complete | 100% |
| Phase 1: Portfolio & Scoring | ⏳ Planned | 0% |
| Phase 2: Asset Management | 📋 Planned | 0% |
| Phase 3: Dashboard | 📋 Planned | 0% |
| Phase 4: Recommendation Engine | 📋 Planned | 0% |
| Phase 5: Polish & Future | 📋 Planned | 0% |

---

## 📝 Notes

- All prices are manually entered (Phase 1-5)
- No transaction history (current quantity only)
- GoogleFinance integration planned for future phase
- Scoring is independent per Portfolio (no question reuse)
- Assets are unique per Wallet (ticker + wallet_id)
- Buy recommendations only (no sell suggestions yet)
