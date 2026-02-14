# Wallet Assets - Unlisted Support Implementation

**Date:** 2026-02-12  
**Status:** Backend Complete - Frontend In Progress  
**Phase:** Phase 2 - Wallet Assets Management

## Overview

Implement support for both listed (B3/NASDAQ) and unlisted (custom) assets in wallet_assets table.

## Problem Statement

Current architecture only supports assets from global `assets` table. Users need ability to add custom assets like:
- Physical Gold/Silver
- Custom crypto wallets
- Private bonds (CDB, LCI, LCA)
- Any non-listed investment

## Solution

Use existing schema in `wallet_assets` table:
- `asset_id` (nullable) → for listed assets
- `custom_name` (nullable) → for unlisted assets

## Database Schema (Already Ready ✅)

```sql
table: wallet_assets
- id: bigint
- wallet_id: foreign_key
- portfolio_id: foreign_key
- asset_id: foreign_key, nullable ← listed assets
- custom_name: text, nullable ← unlisted assets
- score: integer ← asset score for weight calculation
- quantity: decimal
- average_price: decimal
- timestamps

unique: [wallet_id, asset_id, custom_name]
```

## Rules

1. Either `asset_id` OR `custom_name` must be present, never both
2. Same wallet cannot have duplicate entries (enforced by code)
3. Both types support quantity, average_price, and score tracking
4. Display uses: `asset.ticker` for listed, `custom_name` for unlisted
5. Score is used for weight calculation within portfolio (0 = excluded from recommendations)

## Implementation Steps

### 1. Documentation ✅
- [x] Update AGENTS.md with Wallet Assets section
- [x] Update ROADMAP.md Phase 2
- [x] Create this task file

### 2. Models ✅
- [x] WalletAsset - Add custom_name, score to fillable, add accessors
- [x] Portfolio - Add walletAssets relationship

### 3. Validation ✅
- [x] StoreWalletAssetRequest - XOR validation, score validation
- [x] UpdateWalletAssetRequest - Update rules including score

### 4. Actions ✅
- [x] CreateWalletAsset - Listed vs unlisted logic with score
- [x] UpdateWalletAsset - Type switching support with score
- [x] DeleteWalletAsset - Simple delete

### 5. Controllers & Routes ✅
- [x] WalletAssetController - CRUD
- [x] Routes - Resource routes

### 6. TypeScript Types ✅
- [x] WalletAsset interface - Add custom_name, score, display_name, is_listed
- [x] Portfolio interface - Add wallet_assets relationship

## Frontend Implementation (IN PROGRESS)

### Phase 2.2 - Portfolio Edit Page

#### 7. Update Wallet/Edit Page
- [ ] Add eye icon button to Portfolio DataTable
- [ ] Navigate to Portfolio Edit page on click

#### 8. Create Portfolio/Edit Page
- [ ] Create `Pages/Portfolio/Edit.tsx`
- [ ] Follow Wallet Edit page pattern
- [ ] Three sections:
  1. **Edit Portfolio Card** - Name and target_weight inputs
  2. **Add Asset Card** - Form with text inputs (no logic yet)
  3. **Assets List** - Table showing wallet_assets

#### 9. Create Components
- [ ] `WalletAssetForm` - Form component for adding assets
  - Text inputs: asset_id OR custom_name, quantity, average_price
  - Save button (non-functional for now)
- [ ] `WalletAssetList` - Table component for displaying assets
  - Show ticker for listed assets
  - Show custom_name for unlisted assets
  - Edit/Delete actions

#### 10. Routes
- [ ] Add portfolio.edit route
- [ ] Link from Wallet/Edit eye icon

**Note:** AssetSelector component will be created in future phase. For now, use simple text inputs.

## Testing Notes

Test cases needed:
1. ✅ Create listed asset (asset_id provided)
2. ✅ Create unlisted asset (custom_name provided)
3. ✅ Prevent both asset_id and custom_name
4. ✅ Prevent neither asset_id nor custom_name
5. ✅ Prevent duplicate unlisted names in same wallet
6. Navigate to Portfolio Edit page from Wallet Edit
7. Display assets list in Portfolio Edit
8. Add asset form renders correctly

## Future Enhancements

- Price tracking for unlisted assets (manual updates)
- Categories/tags for unlisted assets
- Import/Export unlisted asset definitions
- AssetSelector component with search
