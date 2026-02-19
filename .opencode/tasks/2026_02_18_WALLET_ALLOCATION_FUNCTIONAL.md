# WalletAllocation Funcional - Implementação Completa

**Data:** 2026-02-18  
**Responsável:** AI Assistant  
**Status:** 🔄 Em Progresso

---

## Objetivo

Implementar funcionalidade completa de WalletAllocation na tela Portfolio/Edit, permitindo:
- Buscar e selecionar Assets (listados) e CustomAssets (não listados)
- Criar alocações com score manual
- Editar score de alocações existentes
- Deletar alocações
- CRUD completo de CustomAssets

---

## Decisões Arquiteturais

| Aspecto | Decisão | Justificativa |
|---------|---------|---------------|
| **Rota API** | `GET /api/wallets/{wallet}/available-assets` | Separação de concerns, reutilizável para Transactions |
| **Controller API** | `Api\WalletController@availableAssets` | Controller dedicado à API, preparado para mobile |
| **Busca** | Por `ticker` (Assets) ou `name` (ambos) | CustomAssets não possuem ticker |
| **Indexação** | Migration para indexes em name/ticker | Performance em buscas textuais |
| **Formato JSON** | `asset_id` + `custom_asset_id` + metadados | Facilita binding no React (seta ambos campos) |
| **Score** | Editável a qualquer momento | Usuário pode ajustar peso/pontuação |
| **Troca de Asset** | Não permitida | Delete + recreate se necessário |
| **Delete CustomAsset** | Bloqueado se houver vínculos | Integridade referencial |
| **Ordenação** | Padrão do DB (por id) | Simplicidade |

---

## Iterações

### ✅ Iteração 1: Backend - API e WalletAllocation CRUD
**Status:** ✅ Concluída  
**Tempo Estimado:** 3-4 horas  
**Tempo Real:** ~2 horas

#### 1.1 Migration de Indexação ✅
**Arquivo:** `database/migrations/2026_02_18_131534_add_indexes_to_assets_tables.php`
- Index em `assets.ticker`
- Index em `assets.name`
- Index em `custom_assets.name`

#### 1.2 API Controller ✅
**Arquivo:** `app/Http/Controllers/Api/WalletController.php`
- Método: `availableAssets(Wallet $wallet, Request $request)`
- Busca Assets por ticker ou name
- Busca CustomAssets da carteira por name
- Retorna formato unificado com asset_id e custom_asset_id

#### 1.3 Rotas API ✅
**Arquivo:** `routes/api.php` (criado)
```php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/wallets/{wallet}/available-assets', [Api\WalletController::class, 'availableAssets']);
});
```

#### 1.4 WalletAllocation Actions ✅
**Arquivos:**
- `app/Actions/WalletAllocations/CreateWalletAllocation.php` - Valida XOR, score >= 0
- `app/Actions/WalletAllocations/UpdateWalletAllocation.php` - Atualiza apenas score
- `app/Actions/WalletAllocations/DeleteWalletAllocation.php` - Deleta allocation

#### 1.5 Web Controller ✅
**Arquivo:** `app/Http/Controllers/Web/WalletAllocationController.php`
- `store()` → CreateWalletAllocation
- `update()` → UpdateWalletAllocation (score apenas)
- `destroy()` → DeleteWalletAllocation

#### 1.6 FormRequests ✅
**Arquivos:**
- `StoreWalletAllocationRequest`: valida XOR, score >= 0, autorização por ownership
- `UpdateWalletAllocationRequest`: valida score >= 0, autorização por ownership

#### 1.7 Policy ✅
**Arquivo:** `app/Policies/WalletAllocationPolicy.php` - Verifica ownership via portfolio→wallet→person_id

#### 1.8 Rotas Web ✅
**Arquivo:** `routes/web.php`
```php
Route::resource('wallet-allocations', WalletAllocationController::class)
    ->only(['store', 'update', 'destroy']);
Route::resource('custom-assets', CustomAssetController::class);
```

#### 1.9 CustomAssetController ✅
**Arquivo:** `app/Http/Controllers/Web/CustomAssetController.php`
- CRUD completo com verificação de vínculos

#### 1.10 CustomAssetPolicy ✅
**Arquivo:** `app/Policies/CustomAssetPolicy.php` - Verifica ownership via wallet→person_id

---

### ✅ Iteração 2: Frontend - Componente e Portfolio/Edit
**Status:** ✅ Concluída  
**Tempo Estimado:** 4-5 horas  
**Tempo Real:** ~3 horas

#### 2.1 Hook useAvailableAssets ✅
**Arquivo:** `resources/js/Hooks/useAvailableAssets.ts`
- Debounce de 300ms para busca
- Cancelamento de requisições anteriores
- Cache de resultados
- Tipagem TypeScript completa

#### 2.2 Componente InputTextSelect ✅
**Arquivo:** `resources/js/Components/InputTextSelect.tsx`
- Input com busca em tempo real
- Dropdown com resultados filtrados
- Badge visual "Listado" vs "Customizado"
- Preview do asset selecionado
- Integração com API de busca

#### 2.3 Atualização Portfolio/Edit.tsx ✅
**Arquivo:** `resources/js/Pages/Portfolio/Edit.tsx`
- Substituídos campos asset_id/custom_asset_id por InputTextSelect
- Implementado `createAllocation()` com POST real
- Implementado `deleteAllocation()` com DELETE real
- Adicionado modal para editar score
- Implementado `updateScore()` com PUT
- Validações frontend (score >= 0, asset obrigatório)

#### 2.4 Traduções ✅
**Arquivos:** `resources/js/i18n/locales/pt-BR.ts` e `en.ts`
- Adicionadas chaves para allocations
- Mensagens de validação
- Mensagens de sucesso
- Labels do novo componente

---

### ✅ Iteração 3: Frontend - CustomAssets CRUD
**Status:** ✅ Concluída  
**Tempo Estimado:** 4-5 horas  
**Tempo Real:** ~2 horas

#### 3.1 FormRequests CustomAsset ✅
**Arquivos:**
- `StoreCustomAssetRequest`: validações e autorização
- `UpdateCustomAssetRequest`: validações e autorização

#### 3.2 Backend Controller ✅
**Arquivo:** `app/Http/Controllers/Web/CustomAssetController.php`
- Atualizado para passar assetTypes às views
- CRUD completo com verificação de vínculos

#### 3.3 Páginas React ✅
**Arquivos:**
- `resources/js/Pages/CustomAsset/Index.tsx` - Lista com DataTable
- `resources/js/Pages/CustomAsset/Create.tsx` - Form de criação
- `resources/js/Pages/CustomAsset/Edit.tsx` - Form de edição

#### 3.4 Menu de Navegação ✅
**Arquivo:** `resources/js/lib/navigation.ts`
- Adicionado link "Meus Ativos Customizados" no menu Investimentos

#### 3.5 Traduções ✅
**Arquivos:** `resources/js/i18n/locales/pt-BR.ts` e `en.ts`
- Adicionadas chaves para custom_assets
- Adicionado 'select' em common

#### 2.3 Tipos TypeScript
```typescript
interface AvailableAsset {
    asset_id: number | null;
    custom_asset_id: number | null;
    ticker: string | null;
    name: string;
    asset_type: string | null;
    market: string | null;
    currency: string;
    source: 'listed' | 'unlisted';
}
```

#### 2.4 Atualizar Portfolio/Edit.tsx
- Substituir campos asset_id/custom_asset_id por InputTextSelect
- Implementar `createAllocation()` com POST
- Implementar `deleteAllocation()` com DELETE
- Adicionar modal para editar score
- Implementar `updateAllocation()` com PUT

#### 2.5 Preview do Asset
- Mostrar detalhes do asset selecionado (nome, tipo, mercado)

---

### ⏳ Iteração 3: Frontend - CustomAssets CRUD
**Status:** ⏳ Pendente  
**Tempo Estimado:** 4-5 horas

#### 3.1 Backend CustomAssetController
**Arquivo:** `app/Http/Controllers/Web/CustomAssetController.php`
- CRUD completo
- Validação: não deletar se houver allocations/transactions

#### 3.2 Rotas CustomAssets
**Arquivo:** `routes/web.php`
```php
Route::resource('custom-assets', CustomAssetController::class);
```

#### 3.3 Páginas React
**Arquivos:**
- `resources/js/Pages/CustomAsset/Index.tsx` - Lista com DataTable
- `resources/js/Pages/CustomAsset/Create.tsx` - Form de criação
- `resources/js/Pages/CustomAsset/Edit.tsx` - Form de edição

#### 3.4 Menu de Navegação
**Arquivo:** `resources/js/lib/navigation.ts`
- Adicionar link "Meus Ativos Customizados"

---

### ⏳ Iteração 4: Traduções e Polish
**Status:** ⏳ Pendente  
**Tempo Estimado:** 1-2 horas

#### 4.1 Chaves de Tradução (pt-BR.ts e en.ts)
```typescript
allocations: {
    validation: {
        asset_required: 'Selecione um ativo',
        score_min: 'O score deve ser maior ou igual a 0',
        asset_xor: 'Informe um ativo listado OU um ativo customizado',
    },
    success: {
        created: 'Alocação criada com sucesso',
        updated: 'Alocação atualizada com sucesso',
        deleted: 'Alocação removida com sucesso',
    },
    edit_score: 'Editar Score',
    select_asset: 'Buscar ativo...',
    no_results: 'Nenhum ativo encontrado',
    asset_preview: 'Detalhes do Ativo',
},
custom_assets: {
    title: 'Ativos Customizados',
    subtitle: 'Gerencie seus ativos não listados em bolsas',
    create: 'Novo Ativo',
    edit: 'Editar Ativo',
    delete_blocked: 'Não é possível excluir este ativo pois existem alocações ou transações vinculadas',
    fields: {
        name: 'Nome',
        asset_type: 'Tipo',
        currency: 'Moeda',
    },
    success: {
        created: 'Ativo criado com sucesso',
        updated: 'Ativo atualizado com sucesso',
        deleted: 'Ativo removido com sucesso',
    },
}
```

#### 4.2 Validações Frontend
- Score mínimo 0
- Asset obrigatório
- Feedback visual de erros

#### 4.3 UX Polish
- Loading states
- Empty states
- Confirmações de delete
- Toast notifications

---

## Checklist de Arquivos

### Backend (14 arquivos)
- [x] Migration: `add_indexes_to_assets_tables`
- [x] Controller: `Api/WalletController`
- [x] Action: `CreateWalletAllocation`
- [x] Action: `UpdateWalletAllocation`
- [x] Action: `DeleteWalletAllocation`
- [x] Controller: `Web/WalletAllocationController`
- [x] FormRequest: `StoreWalletAllocationRequest` (com validação de duplicata)
- [x] FormRequest: `UpdateWalletAllocationRequest`
- [x] FormRequest: `StoreCustomAssetRequest`
- [x] FormRequest: `UpdateCustomAssetRequest`
- [x] Policy: `WalletAllocationPolicy` (atualizado)
- [x] Policy: `CustomAssetPolicy` (atualizado)
- [x] Controller: `Web/CustomAssetController` (atualizado)
- [x] Rotas: `api.php` (criado)
- [x] Rotas: `web.php` (atualizado)
- [x] Bootstrap: `app.php` (registrar api.php)

### Frontend (16 arquivos)
- [x] Hook: `useAvailableAssets.ts`
- [x] Componente: `InputTextSelect.tsx`
- [x] Componente: `Toast.tsx`
- [x] Modificar: `Portfolio/Edit.tsx`
- [x] Modificar: `Wallet/Edit.tsx`
- [x] Modificar: `AuthenticatedLayout.tsx`
- [x] Modificar: `SelectInput.tsx`
- [x] Modificar: `types/index.ts` (snake_case)
- [x] Página: `CustomAsset/Index.tsx`
- [x] Página: `CustomAsset/Create.tsx`
- [x] Página: `CustomAsset/Edit.tsx`
- [x] Modificar: `lib/navigation.ts`
- [x] Traduções: `pt-BR.ts` e `en.ts` (incluindo mensagem de duplicata)

---

## API Endpoints

| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/api/wallets/{wallet}/available-assets` | Api\WalletController@availableAssets | Busca assets e custom assets |
| POST | `/wallet-allocations` | WalletAllocationController@store | Cria allocation |
| PUT | `/wallet-allocations/{id}` | WalletAllocationController@update | Atualiza score |
| DELETE | `/wallet-allocations/{id}` | WalletAllocationController@destroy | Deleta allocation |
| GET | `/custom-assets` | CustomAssetController@index | Lista custom assets |
| POST | `/custom-assets` | CustomAssetController@store | Cria custom asset |
| GET | `/custom-assets/{id}/edit` | CustomAssetController@edit | Form edição |
| PUT | `/custom-assets/{id}` | CustomAssetController@update | Atualiza custom asset |
| DELETE | `/custom-assets/{id}` | CustomAssetController@destroy | Deleta custom asset |

---

## Dependências

- Sistema i18n já implementado (pt-BR/en)
- Componentes UI existentes (Card, DataTable, PrimaryButton, etc)
- Autenticação Laravel Breeze configurada
- Models WalletAllocation, Asset, CustomAsset já existentes

---

## Notas Técnicas

### JSON Response Format - availableAssets
```json
{
  "assets": [
    {
      "asset_id": 1,
      "custom_asset_id": null,
      "ticker": "PETR4",
      "name": "Petrobras PN",
      "asset_type": "Ação",
      "market": "BR",
      "currency": "BRL",
      "source": "listed"
    },
    {
      "asset_id": null,
      "custom_asset_id": 5,
      "ticker": null,
      "name": "Ouro Físico",
      "asset_type": "Commodity",
      "market": null,
      "currency": "BRL",
      "source": "unlisted"
    }
  ]
}
```

### Validações Backend
- **Store:** XOR entre asset_id e custom_asset_id, score >= 0
- **Store:** Asset não pode estar duplicado no mesmo portfolio (constraint UNIQUE + validação)
- **Update:** Apenas score, score >= 0
- **Delete CustomAsset:** Bloqueado se existir wallet_allocations ou transactions

---

## Progresso

- [x] Criar documentação do plano
- [x] Iteração 1: Backend ✅
  - [x] Migration de indexação
  - [x] API Controller
  - [x] Actions
  - [x] Web Controller
  - [x] FormRequests
  - [x] Policy
  - [x] Rotas
- [x] Iteração 2: Frontend Portfolio/Edit ✅
  - [x] Hook useAvailableAssets
  - [x] Componente InputTextSelect
  - [x] Atualização Portfolio/Edit.tsx
  - [x] Traduções
- [x] Iteração 3: CustomAssets CRUD ✅
  - [x] Páginas Index/Create/Edit
  - [x] Menu de navegação
  - [x] Traduções
- [x] Iteração 4: Polish ✅
  - [x] Toast notifications
  - [x] Empty states
  - [x] Layout atualizado com ToastContainer

---

## Implementação Completa! 🎉

### Resumo
Todas as iterações foram concluídas com sucesso:

1. ✅ **Backend**: API, Actions, Controllers, FormRequests, Policies
2. ✅ **Frontend**: Portfolio/Edit com busca de ativos
3. ✅ **CustomAssets**: CRUD completo
4. ✅ **Polish**: Toast notifications, empty states, loading states

### Arquivos Criados/Modificados: 29

### Para Executar
```bash
# Executar migration
php artisan migrate

# Limpar caches
php artisan optimize:clear

# Executar em modo desenvolvimento
npm run dev
php artisan serve
```

### Funcionalidades
- Busca de Assets (listados e customizados) em tempo real
- Criar/Editar/Deletar alocações com score
- Validação de asset duplicado no portfolio
- CRUD completo de CustomAssets
- Validações frontend e backend
- Toast notifications para feedback

---

## 🐛 Correções Aplicadas

### Correção: Nomenclatura de Relacionamentos (snake_case vs camelCase)
**Problema:** O Laravel serializa relacionamentos em `snake_case` (ex: `wallet_allocations`), mas os types TypeScript estavam em `camelCase` (ex: `walletAllocations`), causando dados undefined.

**Solução:** Atualizados todos os types para usar `snake_case`:

```typescript
// Antes (❌ não funcionava)
interface Portfolio {
    walletAllocations?: WalletAllocation[];
}

// Depois (✅ funciona)
interface Portfolio {
    wallet_allocations?: WalletAllocation[];
}
```

**Arquivos Corrigidos:**
- `resources/js/types/index.ts` - Todos os relacionamentos em snake_case
- `resources/js/Pages/Portfolio/Edit.tsx` - Usando `wallet_allocations` e `custom_asset`
- `resources/js/Pages/Wallet/Edit.tsx` - Usando `wallet_allocations`
- Toast notifications para feedback
- Empty states quando não há dados

### Correção: Validação de Asset Duplicado
**Problema:** O sistema permitia salvar o mesmo asset múltiplas vezes na mesma wallet.

**Solução:** 
1. Adicionada constraint UNIQUE no banco de dados (wallet_id + asset_id/custom_asset_id)
2. Validação customizada no `StoreWalletAllocationRequest` com `withValidator`
3. Mensagem de erro amigável exibida no frontend: "Este ativo já está alocado nesta carteira"
4. Traduções adicionadas (pt-BR e en)

**Arquivos Modificados:**
- `app/Http/Requests/StoreWalletAllocationRequest.php` - Validação de duplicata
- `resources/js/Pages/Portfolio/Edit.tsx` - Tratamento de erro no onError
- `resources/js/i18n/locales/pt-BR.ts` - Tradução `asset_duplicate`
- `resources/js/i18n/locales/en.ts` - Tradução `asset_duplicate`

---

## Referências

- Database Structure Plan: `.opencode/plans/database-structure-plan.md`
- i18n Implementation: `.opencode/tasks/2026_02_17_INTERNACIONALIZACAO_I18N.md`
- Wallet Assets Unlisted Support: `.opencode/tasks/2026_02_12_230836_WALLET_ASSETS_UNLISTED_SUPPORT.md`
