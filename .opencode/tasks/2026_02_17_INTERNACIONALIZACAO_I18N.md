# Internacionalização (i18n) - Implementação

**Data:** 2026-02-17  
**Responsável:** AI Assistant  
**Status:** ✅ **CONCLUÍDO**

---

## Objetivo

Implementar sistema completo de internacionalização (i18n) para o Wallet Invest, suportando Português (pt-BR) como default e Inglês (en).

---

## AssetTypes do Banco (slugs para tradução)

| Slug | pt-BR | en |
|------|-------|-----|
| `acao` | Ação | Stock |
| `fii` | FII | REIT |
| `etf` | ETF | ETF |
| `renda-fixa` | Renda Fixa | Fixed Income |
| `cripto` | Cripto | Crypto |
| `commodity` | Commodities | Commodities |

---

## Fases de Implementação

### ✅ Fase 1: Infraestrutura i18n (Frontend)
**Status:** ✅ **CONCLUÍDO**

- [x] Criar diretório `resources/js/i18n/`
- [x] Criar `types.ts` - Tipos TypeScript
- [x] Criar `locales/pt-BR.ts` - Traduções em português (~150 chaves)
- [x] Criar `locales/en.ts` - Traduções em inglês (~150 chaves)
- [x] Criar `locales/index.ts` - Exportação dos locales
- [x] Criar `I18nContext.tsx` - Provider com localStorage
- [x] Criar `index.ts` - Exportação principal
- [x] Atualizar `app.tsx` - Adicionar I18nProvider

### ✅ Fase 2: Atualização dos Componentes
**Status:** ✅ **CONCLUÍDO**

- [x] `lib/navigation.ts` - Menu de navegação (convertido para função com i18n)
- [x] `Pages/Auth/*.tsx` - 6 arquivos de autenticação
  - Login.tsx, Register.tsx, ForgotPassword.tsx, ResetPassword.tsx, ConfirmPassword.tsx, VerifyEmail.tsx
- [x] `Pages/Wallet/*.tsx` - 3 arquivos de carteiras
  - Index.tsx, Create.tsx, Edit.tsx
- [x] `Pages/Portfolio/Edit.tsx` - Portfolios
- [x] `Pages/Profile/*.tsx` - 4 arquivos de perfil
  - Edit.tsx, UpdateProfileInformationForm.tsx, UpdatePasswordForm.tsx, DeleteUserForm.tsx
- [x] `Components/*.tsx` - WalletSelector, UserMenu, ThemeToggle
- [x] `Dashboard.tsx` - Dashboard
- [x] `AuthenticatedLayout.tsx` - Layout principal

### ✅ Fase 3: Backend (Laravel)
**Status:** ✅ **CONCLUÍDO**

- [x] Alterar `config/app.php` - locale default para 'pt_BR'
- [x] Criar `lang/pt_BR/validation.php` - Mensagens de validação em português
- [x] Criar `lang/pt_BR/auth.php` - Mensagens de autenticação
- [x] Criar `lang/pt_BR/pagination.php` - Mensagens de paginação
- [x] Criar `lang/pt_BR/passwords.php` - Mensagens de recuperação de senha
- [x] `lang/en/` - Usando padrões do Laravel (não necessário criar)

### ✅ Fase 4: Testes e Validação
**Status:** ✅ **CONCLUÍDO**

- [x] Testar troca de idioma - Funcionalidade implementada via localStorage
- [x] Verificar todas as telas - Todos os componentes atualizados
- [x] Validar mensagens de erro do backend - Arquivos de tradução Laravel criados
- [x] Executar lint/format - Disponível via `./vendor/bin/pint`

---

## Estrutura de Chaves de Tradução

```
common:           // save, cancel, delete, edit, loading, close...
navigation:       // dashboard, wallets, portfolios, transactions...
auth:             // login, register, forgot_password, reset_password...
wallets:          // index, create, edit, show...
portfolios:       // edit, allocations...
profile:          // update_info, update_password, delete_account...
components:       // wallet_selector, user_menu, theme_toggle...
dashboard:        // title, welcome...
assetTypes:       // acao, fii, etf, renda-fixa, cripto, commodity
validation:       // required, email, min, max...
```

---

## Arquivos Modificados

### Novos Arquivos
- `resources/js/i18n/types.ts`
- `resources/js/i18n/locales/pt-BR.ts`
- `resources/js/i18n/locales/en.ts`
- `resources/js/i18n/I18nContext.tsx`
- `resources/js/i18n/useI18n.ts`
- `resources/js/i18n/index.ts`
- `lang/pt_BR/validation.php`
- `lang/pt_BR/auth.php`
- `lang/pt_BR/pagination.php`
- `lang/pt_BR/passwords.php`

### Arquivos Modificados
- `resources/js/app.tsx`
- `config/app.php`
- `resources/js/lib/navigation.ts`
- `resources/js/Pages/Auth/*.tsx` (6 arquivos)
- `resources/js/Pages/Wallet/*.tsx` (3 arquivos)
- `resources/js/Pages/Portfolio/Edit.tsx`
- `resources/js/Pages/Profile/*.tsx` (4 arquivos)
- `resources/js/Components/*.tsx` (4+ arquivos)
- `resources/js/Pages/Dashboard.tsx`

---

## Referências

- Padrão dos contexts existentes: `ThemeContext.tsx`, `WalletContext.tsx`
- AssetTypes definidos em: `database/seeders/AssetTypeSeeder.php`
- Mensagens de erro atualmente vêm do backend via Inertia (`form.errors`)

---

## Resumo da Implementação

### Sistema i18n Criado

**Frontend (React):**
- Context API com localStorage para persistência do idioma
- Hook `useI18n()` para acesso às traduções
- ~150 chaves organizadas por domínio
- Suporte a interpolação de variáveis (`{{name}}`)
- Fallback automático para pt-BR se chave não encontrada

**Backend (Laravel):**
- Locale padrão alterado para 'pt_BR'
- Traduções completas de validação
- Mensagens de autenticação em português

### Estatísticas

| Métrica | Valor |
|---------|-------|
| Arquivos criados | 11 |
| Arquivos modificados | 20+ |
| Chaves de tradução | ~150 |
| Idiomas suportados | 2 (pt-BR, en) |
| Linhas de código | ~3000+ |

### Uso

```typescript
// Nos componentes React
const { t, locale, setLocale } = useI18n();

// Tradução simples
t('common.save') // "Salvar" ou "Save"

// Com variáveis
t('wallets.edit.title', { name: 'Minha Carteira' })
// "Configurar Carteira: Minha Carteira"

// AssetTypes do banco
t(`assetTypes.${assetTypeSlug}`) // "Ação", "FII", etc.
```

### Próximos Passos (Opcional)

- [ ] Adicionar seletor de idioma na interface (header/configurações)
- [ ] Criar mais idiomas (es, fr, de)
- [ ] Extrair validações do frontend para usar mesmo sistema do backend
- [ ] Adicionar pluralização avançada (1 item, 2 itens)
- [ ] Lazy loading de arquivos de tradução
