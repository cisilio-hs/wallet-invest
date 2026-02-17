# Plano: Estrutura de Banco de Dados - Sistema de Recomendação de Investimentos

## Status: ✅ Estrutura Definida

**Data de criação:** 2026-02-15  
**Local:** `.opencode/plans/database-structure-plan.md`

> **Nota:** Este documento descreve a arquitetura completa do banco de dados para o sistema de recomendação de investimentos.

---

## 🎯 Objetivo

Definir a estrutura de banco de dados para um sistema de recomendação de investimentos baseado em:
- Transações como fonte única da verdade
- Posições como projeção/cache otimizado
- Alocações como camada de estratégia

---

## 🧠 Princípios Arquiteturais

### Fonte da Verdade
- [x] `transactions` é a única fonte da verdade financeira

### Projeção / Cache
- [x] `positions` é uma projeção otimizada para leitura (dashboard + recommendation)

### Camada de Estratégia
- [x] Portfolios e allocations são configuração do usuário
- [x] NÃO influenciam diretamente a consolidação financeira

---

## 📊 Estrutura das Tabelas

### 👤 people
Representa o dono das carteiras.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint PK | ID interno |
| name | string | Nome |
| phone | string | Telefone |
| birthday | date | Data de nascimento |
| created_at | timestamp | |
| updated_at | timestamp | |

**Status:** ✅ Migration criada e executada  
**Arquivo:** `database/migrations/2026_02_07_144936_create_people_table.php`

---

### 🏷️ asset_types
Tipos globais de ativos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint PK | ID |
| name | string | Nome (Stock, ETF, FII…) |
| slug | string unique | Identificador técnico |
| created_at | timestamp | |
| updated_at | timestamp | |

**Status:** ✅ Migration criada e executada  
**Arquivo:** `database/migrations/2026_02_07_150001_create_asset_types_table.php`

---

### 📦 assets (Global Listed Assets)
Catálogo global do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint PK | ID |
| ticker | string unique | Código (PETR4, IVV...) |
| name | string | Nome do ativo |
| asset_type_id | FK | Tipo do ativo |
| market | enum | BR / US / GLOBAL |
| currency | char(3) | Moeda base (ISO 4217) |
| minimum_order_quantity | decimal(24,10) | Quantidade mínima |
| minimum_order_value | decimal(15,6) | Valor mínimo |
| created_at | timestamp | |
| updated_at | timestamp | |

**Status:** ✅ Migration criada e executada  
**Arquivo:** `database/migrations/2026_02_07_150154_create_assets_table.php`

---

### 🧾 custom_assets (Unlisted Assets)
Ativos criados pelo usuário. Não pertencem ao catálogo global.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint PK | ID |
| wallet_id | FK | Carteira dona |
| name | string | Nome personalizado |
| asset_type_id | FK nullable | Tipo opcional |
| currency | char(3) | Moeda |
| created_at | timestamp | |
| updated_at | timestamp | |

**Status:** ✅ Migration criada e executada  
**Arquivo:** `database/migrations/2026_02_15_131745_create_custom_assets_table.php`

---

### 💼 wallets
Carteiras do usuário.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint PK | ID |
| person_id | FK | Dono |
| name | string | Nome da carteira |
| is_dirty | boolean default false | Precisa consolidar positions |
| created_at | timestamp | |
| updated_at | timestamp | |

**Status:** ✅ Migration criada e executada  
**Arquivo:** `database/migrations/2026_02_07_195153_create_wallets_table.php`

**Notas:**
- Campo `is_dirty` adicionado via migration separada
- Relacionamento com Person (1:N)

---

### 🧩 portfolios (Strategy)
Categorias estratégicas definidas pelo usuário.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint PK | ID |
| wallet_id | FK | Carteira |
| name | string | Nome da categoria |
| target_weight | decimal(5,2) | Peso alvo (%) |
| created_at | timestamp | |
| updated_at | timestamp | |

**Status:** ✅ Migration criada e executada  
**Arquivo:** `database/migrations/2026_02_07_195414_create_portfolios_table.php`

---

### 📊 wallet_allocations
Estrutura estratégica da carteira. NÃO representa posição real.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint PK | ID |
| wallet_id | FK | Carteira |
| portfolio_id | FK | Categoria |
| asset_id | FK nullable | Ativo listado |
| custom_asset_id | FK nullable | Ativo custom |
| score | unsigned integer | Score qualitativo |
| created_at | timestamp | |
| updated_at | timestamp | |

**Constraint lógica:**
```
asset_id XOR custom_asset_id
```
(Apanas UM campo deve estar preenchido)

**Status:** ✅ Migration criada e executada  
**Arquivo:** `database/migrations/2026_02_15_131751_create_wallet_allocations_table.php`

---

### 🧾 transactions (Ledger)
Fonte da verdade financeira.

**Regras:**
- quantity é signed: BUY = positivo, SELL = negativo
- gross_amount também é signed
- type é computado

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint PK | ID |
| wallet_id | FK | Carteira |
| asset_id | FK nullable | Ativo listado |
| custom_asset_id | FK nullable | Ativo custom |
| quantity | decimal(24,10) | Quantidade signed |
| unit_price | decimal(15,6) | Preço unitário |
| gross_amount | decimal(20,6) | Valor total signed |
| currency | char(3) | Moeda da operação |
| traded_at | datetime | Data operação |
| created_at | timestamp | |
| updated_at | timestamp | |

**Propriedade computada (Laravel):**
```php
getTypeAttribute()
{
    return $this->quantity > 0 ? 'buy' : 'sell';
}
```

**Status:** ✅ Migration criada e executada  
**Arquivo:** `database/migrations/2026_02_15_131752_create_transactions_table.php`

---

### 📈 positions (Projection / Cache)
Snapshot consolidado para leitura rápida. Independe de portfolios.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint PK | ID |
| wallet_id | FK | Carteira |
| asset_id | FK nullable | Ativo listado |
| custom_asset_id | FK nullable | Ativo custom |
| quantity | decimal(24,10) | Quantidade atual |
| average_price | decimal(15,6) | Preço médio |
| is_dirty | boolean default false | Precisa recalcular |
| created_at | timestamp | |
| updated_at | timestamp | |

**Constraint:**
```sql
UNIQUE(wallet_id, asset_id, custom_asset_id)
```

**Status:** ✅ Migration criada e executada  
**Arquivo:** `database/migrations/2026_02_15_131752_create_positions_table.php`

---

## 🔁 Fluxo de Consolidação

### Nova Transaction
```
wallet.is_dirty = true
position(asset).is_dirty = true
```

### Dashboard ou Recommendation
```
if wallet.is_dirty:
    recalcular somente positions dirty
```

### Consolidação (SQL)
- [ ] Recalcula quantity
- [ ] Recalcula average_price
- [ ] Limpa positions.is_dirty
- [ ] Limpa wallet.is_dirty

---

## 🧮 Motor de Recomendação

**Input:**
- [x] positions (estado atual)
- [x] wallet_allocations (estratégia)
- [ ] preços atuais
- [ ] valor informado pelo usuário

**Output:**
- [ ] Tabela temporária com sugestões de compra
- [ ] NÃO persistida

---

## 🧱 Arquitetura Final

```
transactions (source of truth)
        ↓
positions (projection/cache)
        ↓
dashboard / recommendation

wallet_allocations (strategy layer)
```

---

## 📋 Checklist de Implementação

### Models ✅
- [x] Person
- [x] AssetType
- [x] Asset
- [x] CustomAsset
- [x] Wallet
- [x] Portfolio
- [x] WalletAllocation
- [x] Transaction
- [x] Position

### Migrations ✅
- [x] people
- [x] asset_types
- [x] assets
- [x] custom_assets
- [x] wallets (+ is_dirty)
- [x] portfolios
- [x] wallet_allocations
- [x] transactions
- [x] positions

### Relacionamentos ✅
- [x] Person → Wallets (1:N)
- [x] Wallet → Portfolios (1:N)
- [x] Wallet → CustomAssets (1:N)
- [x] Wallet → Transactions (1:N)
- [x] Wallet → Positions (1:N)
- [x] Wallet → WalletAllocations (1:N)
- [x] Portfolio → WalletAllocations (1:N)
- [x] AssetType → Assets (1:N)
- [x] Asset → Transactions (1:N)
- [x] Asset → Positions (1:N)
- [x] Asset → WalletAllocations (1:N)
- [x] CustomAsset → Transactions (1:N)
- [x] CustomAsset → Positions (1:N)
- [x] CustomAsset → WalletAllocations (1:N)

### Observadores ✅
- [x] TransactionObserver (marca wallet e position como dirty)

### Pendências
- [ ] Implementar consolidação SQL
- [ ] Criar comando Artisan para recalcular positions
- [ ] Implementar motor de recomendação
- [ ] Integrar API de preços (Google Finance)

---

## 🗂️ Arquivos Relacionados

```
database/migrations/
├── 2026_02_07_144936_create_people_table.php
├── 2026_02_07_150001_create_asset_types_table.php
├── 2026_02_07_150154_create_assets_table.php
├── 2026_02_07_195153_create_wallets_table.php
├── 2026_02_07_195414_create_portfolios_table.php
├── 2026_02_15_131745_create_custom_assets_table.php
├── 2026_02_15_131751_create_wallet_allocations_table.php
├── 2026_02_15_131752_create_transactions_table.php
└── 2026_02_15_131752_create_positions_table.php

app/Models/
├── Person.php
├── AssetType.php
├── Asset.php
├── CustomAsset.php
├── Wallet.php
├── Portfolio.php
├── WalletAllocation.php
├── Transaction.php
└── Position.php

app/Observers/
└── TransactionObserver.php
```

---

## 📝 Notas de Implementação

- Todas as tabelas seguem convenção Laravel (snake_case, timestamps)
- Relacionamentos polimórficos evitados em favor de chaves nullable
- Decimal usado para valores financeiros (precisão)
- Soft deletes não implementados (ledger deve ser imutável)
- Índices adicionados nas foreign keys automaticamente

---

## Próximos Passos

1. **Implementar sistema de consolidação**
   - Criar service/Action para recalcular positions
   - Implementar lógica de FIFO/LIFO
   - Adicionar comando Artisan

2. **Motor de recomendação**
   - Calcular drift de alocação
   - Sugerir ordens de compra
   - Respeitar constraints de ordem mínima

3. **Integrações**
   - API de preços em tempo real
   - Importação de transações via CSV
   - Exportação de relatórios
