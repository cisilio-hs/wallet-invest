# Task: Módulo de Positions (Leitura + Consolidação Automática)

**Data:** 2026-03-03  
**Responsável:** AI Assistant  
**Status:** ✅ **CONCLUÍDO**  
**Local:** `.opencode/tasks/2026_0303_125556_POSITIONS_MODULE.md`

---

## Objetivo

Implementar o módulo de Positions como **projeção calculada automaticamente** a partir de Transactions:
- **Visualização** - UI para exibir positions (read-only)
- **Consolidação automática** - Recalcular positions quando Transactions mudam
- **Sem CRUD manual** - Usuário não cria/edita/deletam positions diretamente

---

## Contexto

**Positions** é uma tabela de projeção/cache derived from Transactions:

```
transactions (source of truth)
        ↓
positions (projeção/cache - leitura)
        ↓
dashboard / recommendation
```

**Regras de Negócio:**
1. Ao criar Transaction para **novo asset** (sem Position ainda): criar Position vazia com `is_dirty=true`
2. Ao criar Transaction que zera a quantity (qtd=0): **deletar a Position**
3. Usuário **NUNCA** edita positions manualmente
4. Toda modificação em Transactions dispara recalculo
5. Comando de recalcular pertence à Position (1 asset)
6. Comando da wallet apenas itera positions com `is_dirty=true` daquela wallet
7. **Segurança**: Comandos devem validar ownership da wallet pelo usuário

**Cálculo de Position:**
- `quantity`: Soma de todas as quantities (compras - vendas)
- `average_price`: Custo médio ponderado (FIFO ou média simples)
- `is_dirty`: true quando precisa recalcular

---

## Step-by-Step

### Phase 1: Model e Scopes

- [x] **Position.php** - Adicionar scopes úteis
  - Scope withAsset() - eager load asset
  - Scope dirty() - positions que precisam recalcular
  - Scope hasQuantity() - positions com quantity > 0

> **Nota**: O escopo `forWallet` foi removido. Usar `$wallet->positions` diretamente é mais idiomático no Laravel. A segurança é garantida pela Policy chamada explicitamente no Controller.

---

### Phase 2: Recalculate Action (Core do Sistema)

- [x] **RecalculatePosition.php**
  - Recebe wallet_id + asset_id OU custom_asset_id
  - Busca todas as transactions do asset na wallet
  - Calcula:
    - quantity: soma de quantities (buy positivo, sell negativo)
    - average_price: custo médio = total_investido / quantity
  - **Se quantity = 0**: Deletar a position (não manter registros com qtd 0)
  - **Se quantity > 0**: Cria ou atualiza a position
  - Marca is_dirty = false
  - Retorna position calculada (ou null se deletada)

- [x] **RecalculateAllPositions.php** (para comando da wallet)
  - Recebe wallet_id
  - Valida ownership do usuário sobre a wallet
  - Busca todas as positions com is_dirty=true da wallet
  - Para cada uma, chama RecalculatePosition
  - Retorna resumo (quantas recalculadas, erros, etc)

---

### Phase 3: Policy

- [x] **PositionPolicy.php** (apenas leitura)
  - view: usuário é dono da wallet
  - (Sem create, update, delete - usuário não edita)

---

### Phase 4: Controller (apenas visualização)

- [x] **PositionController.php**
  - index() - listar positions da wallet (com paginação, apenas qtd > 0)
  - show() - detalhes de uma position
  - recalculate() - força recalculo de uma position específica
  - (Sem store, update, destroy - apenas leitura)

---

### Phase 5: Rotas e Menu

**Decisão de Arquitetura**: Usar rotas aninhadas (`/wallets/{wallet}/positions`) para maior semanticidade e cleaner URLs.

- [x] **routes/web.php**
  - GET /wallets/{wallet}/positions (index)
  - GET /wallets/{wallet}/positions/{position} (show)
  - POST /wallets/{wallet}/positions/{position}/recalculate (recalculate)

- [x] **navigation.ts**
  - Atualizar link de Positions para usar rota aninhada com wallet dinâmica
  - Ex: `/wallets/{currentWalletId}/positions`
  - Usar função que obtém currentWalletId do contexto

- [x] **WalletContext.tsx**
  - Expor `currentWalletId` para uso na Sidebar/Navigation
  - Já existe, apenas garantir que está acessível

---

### Phase 6: Frontend - Types

- [x] **resources/js/types/index.ts**
  - Position interface (read-only)
  - PositionWithAsset type
  - Pagination<Position> type

---

### Phase 7: Frontend - Pages (2 arquivos)

- [x] **Position/Index.tsx**
  - DataTable com listagem de positions
  - Colunas: Ativo, Quantity, Average Price, Total Value, % do Portfolio
  - Badge/Aviso visual quando is_dirty = true (cor diferente)
  - Botão "Sincronizar" para forçar recalculate
  - **Read-only** - sem Edit/Delete

- [x] **Position/Show.tsx**
  - Detalhes da position
  - Badge/Aviso visual quando is_dirty = true
  - Histórico de transactions do ativo
  - Botão para forçar recalculate

---

### Phase 8: Frontend - Wallet com Dirty

> **Status:** Adiado para Dashboard Unificado
> 
> As telas de Wallet estão mais ligadas ao Portfolio, então não temos necessidade de adicionar botão de sincronização nelas. Essa funcionalidade será adicionada quando unificarmos em Dashboard.

- [ ] **Dashboard** - Exibir banner de sincronização quando Wallet/Position dirty
  - Verificar se wallet.is_dirty = true
  - Se dirty: exibir banner/aviso proeminente
  - Botão "Sincronizar Todas" que chama recalculate de todas as positions
  - Isso dispara o comando interno para cada position

---

### Phase 9: Traduções

- [x] **lang/pt-BR.json**
  - positions.index.title
  - positions.show.title
  - positions.fields.*
  - positions.dirty.warning
  - positions.sync.button

- [x] **lang/en.json**
  - Same keys

---

### Phase 10: Integração com Transactions (3 arquivos)

- [x] **CreateTransaction.php** - Modificar para:
  - Após criar transaction
  - **Se não existir Position**: criar Position vazia com is_dirty=true
  - **Se existir Position**: chamar RecalculatePosition para o asset

- [x] **UpdateTransaction.php** - Modificar para:
  - Após editar transaction
  - Chamar RecalculatePosition para o asset

- [x] **DeleteTransaction.php** - Modificar para:
  - Após deletar transaction
  - Chamar RecalculatePosition para o asset (pode deletar se qtd=0)

---

### Phase 11: Console Commands

- [x] **RecalculatePositionCommand.php**
  - Comando: `php artisan positions:recalculate {wallet_id} {--asset=} {--custom-asset=}`
  - Parâmetros: wallet_id (obrigatório)
  - Opções: --asset=ID ou --custom-asset=ID para recalcular posição específica
  - **Validação**: Verificar que o usuário é dono da wallet (usar auth ou passar user_id)
  - Se não passar asset/custom_asset: recalcula todos os assets da wallet
  - Retorna output com resultado

- [x] **RecalculateWalletCommand.php** (wrapper)
  - Comando: `php artisan wallet:recalculate {wallet_id} {--force}`
  - Valida ownership da wallet
  - Chama RecalculatePositionCommand para cada position com is_dirty=true
  - Opção --force para recalcular todas, não só dirty

---

## Fluxo de Dados

```
1. Usuário cria transaction (compra/venda)
   ↓
2. CreateTransaction executa
   ↓
3. SE Position não existe: criar Position vazia (is_dirty=true)
   ↓
4. RecalculatePosition é chamado
   ↓
5. SE quantity = 0: Position é DELETADA
   ↓
6. SE quantity > 0: Position atualizada
   ↓
7. UI exibe position atualizada
```

---

## Arquivos a Criar/Modificar

### Novos (9 arquivos)
1. app/Actions/Positions/RecalculatePosition.php
2. app/Actions/Positions/RecalculateAllPositions.php
3. app/Policies/PositionPolicy.php (view only)
4. app/Console/Commands/RecalculatePositionCommand.php
5. app/Console/Commands/RecalculateWalletCommand.php
6. resources/js/Pages/Position/Index.tsx
7. resources/js/Pages/Position/Show.tsx
8. resources/js/types/index.ts (atualizar)
9. lang/pt-BR.json (atualizar)

### Modificar (9 arquivos)
1. app/Models/Position.php - adicionar scopes
2. app/Http/Controllers/Web/PositionController.php - rotas aninhadas + leitura + recalculate
3. routes/web.php - rotas aninhadas
4. app/Actions/Transactions/CreateTransaction.php - integrar recalculate + criar Position vazia
5. app/Actions/Transactions/UpdateTransaction.php - integrar recalculate
6. app/Actions/Transactions/DeleteTransaction.php - integrar recalculate
7. lang/en.json (atualizar)
8. resources/js/lib/navigation.ts - gerar URLs dinâmicas com wallet atual
9. resources/js/Pages/Wallet/Index.tsx - adicionar banner dirty + botão sincronizar

---

## Regras de Negócio (Resumo)

| Cenário | Ação |
|---------|------|
| Transaction para asset sem Position | Criar Position vazia (is_dirty=true) |
| Transaction zera quantity (qtd=0) | Deletar Position |
| Transaction modifica quantity > 0 | Atualizar Position |
| Wallet dirty | Mostrar aviso + botão sincronizar na UI |
| Position dirty | Mostrar badge + botão sincronizar na UI |
| Console command wallet | Validar ownership do usuário |
| Console command position | Validar ownership da wallet |

---

## Critérios de Aceitação

1. ✅ UI exibe positions calculadas corretamente
2. ✅ Criar transaction para novo asset cria Position vazia
3. ✅ Criar transaction que zera quantity deleta Position
4. ✅ Criar/Editar/Deletar transaction recalcula position automaticamente
5. ⏳ Banner/Aviso na UI quando Wallet dirty (adiado para Dashboard)
6. ✅ Banner/Aviso na UI quando Position dirty
7. ✅ Botão sincronizar funciona na UI
8. ✅ Console commands validam ownership
9. ✅ Policy chamada explicitamente no Controller (segurança)
10. ✅ Testes passando

---

## Estimativa

**Tempo:** ~2-3 horas

---

## Notas

- **Regra de ouro**: Position é derivada, nunca editada manualmente
- **Performance**: Usar chunking para muitas transactions
- **Segurança**: Policy chamada explicitamente no Controller garante que usuário só acessa suas próprias wallets
- **Console**: Commands devem validar ownership (pode usar user_id como parâmetro ou obter do auth)
- **Rotas**: Rotas aninhadas (`/wallets/{wallet}/positions`) para melhor semanticidade
- **Frontend**: Sidebar gera URLs dinâmicas usando currentWalletId do WalletContext
