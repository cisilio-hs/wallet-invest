# Task: UI Redesign - Novo Layout com Sidebar e Dark Mode

**Status:** ✅ CONCLUÍDO (exceto mobile)  
**Data de criação:** 2026-02-15  
**Data de conclusão:** 2026-02-17  
**Responsável:** AI Assistant  
**Local:** `.opencode/tasks/2026_02_15_UI_REDESIGN.md`

> **Nota:** Este arquivo está em `.opencode/tasks/` (com ponto inicial). Todos os arquivos de task devem ser criados neste diretório, conforme convenção do projeto.

---

## Objetivo
Implementar novo design de interface com menu lateral colapsável, topbar avançada, e suporte completo a dark/light mode, seguindo a referência visual fornecida.

## Referência Visual
- Design baseado na imagem: sidebar azul escuro com menu colapsável
- Topbar com abas, botões de ação e menu do usuário
- Suporte a badges em itens de menu
- Submenus expansíveis com animações

---

## FASE 1: Sistema de Tema (Theme System) ✅

### Tarefas:
- [x] Criar ThemeContext (`resources/js/Contexts/ThemeContext.tsx`)
  - Gerenciamento de estado do tema (light/dark)
  - Persistência no localStorage
  - Detecção de preferência do sistema
  - Hook useTheme()

- [x] Configurar Tailwind (`tailwind.config.js`)
  - Adicionar darkMode: 'class'
  - Configurar cores customizadas
  - Extender tema com variáveis

- [x] CSS Global (`resources/css/app.css`)
  - Variáveis CSS para dark mode
  - Variáveis CSS para light mode
  - Cores de background, texto, bordas, accent

**Arquivos criados/modificados:**
- ✅ `resources/js/Contexts/ThemeContext.tsx`
- ✅ `tailwind.config.js`
- ✅ `resources/css/app.css`

---

## FASE 2: Componentes do Sidebar ✅

### Tarefas:
- [x] SidebarContext (`resources/js/Components/Sidebar/SidebarContext.tsx`)
  - Estado de colapso/expandido
  - Persistência no localStorage
  - Toggle function
  - Gerenciamento de submenu ativo (activeSubmenu)

- [x] Sidebar Container (`resources/js/Components/Sidebar/Sidebar.tsx`)
  - Largura: 64px (colapsado) / 256px (expandido)
  - Animação de transição suave (300ms)
  - Toggle button movido para topbar
  - Logo area adaptativa
  - Menu content com overflow controlado

- [x] SidebarItem (`resources/js/Components/Sidebar/SidebarItem.tsx`)
  - Props: label, href, icon, badge, active, forceShowLabel
  - Estados: hover, active
  - Suporte a ícones do Heroicons
  - Texto truncado quando necessário

- [x] SidebarSubmenu (`resources/js/Components/Sidebar/SidebarSubmenu.tsx`)
  - Expansão/recolhimento com animação
  - Animação de slide (translate-x)
  - Seta rotacionável (ChevronDownIcon)
  - Suporte a estado collapsed (dropdown flutuante)
  - Posicionamento dinâmico baseado no botão
  - Delay de 300ms ao esconder para UX
  - Apenas um submenu aberto por vez
  - Animação completa a cada interação

- [x] SidebarSection (`resources/js/Components/Sidebar/SidebarSection.tsx`)
  - Cabeçalho opcional
  - Divisor visual quando collapsed
  - Agrupamento lógico de itens

**Arquivos criados:**
- ✅ `resources/js/Components/Sidebar/SidebarContext.tsx`
- ✅ `resources/js/Components/Sidebar/Sidebar.tsx`
- ✅ `resources/js/Components/Sidebar/SidebarItem.tsx`
- ✅ `resources/js/Components/Sidebar/SidebarSubmenu.tsx`
- ✅ `resources/js/Components/Sidebar/SidebarSection.tsx`
- ✅ `resources/js/Components/Sidebar/index.tsx`

---

## FASE 3: Componentes da Topbar ✅

### Tarefas:
- [x] Topbar Container (`resources/js/Components/Topbar/Topbar.tsx`)
  - Altura fixa (64px)
  - Layout flex com espaçamento
  - Z-index adequado

- [x] TopbarIconWithBadge (`resources/js/Components/Topbar/TopbarIconWithBadge.tsx`)
  - Ícone com badge (notificações)
  - Props: count, maxCount
  - Hover states

- [x] UserMenu (`resources/js/Components/Topbar/UserMenu.tsx`)
  - Avatar com fallback (primeira letra do nome)
  - Dropdown: Profile, Logout
  - Cores padronizadas com sidebar (--sidebar-bg)
  - Hover states

- [x] ThemeToggle (`resources/js/Components/Topbar/ThemeToggle.tsx`)
  - Ícone sol/lua
  - Toggle entre temas
  - Integração com ThemeContext

**Arquivos criados:**
- ✅ `resources/js/Components/Topbar/Topbar.tsx`
- ✅ `resources/js/Components/Topbar/TopbarIconWithBadge.tsx`
- ✅ `resources/js/Components/Topbar/UserMenu.tsx`
- ✅ `resources/js/Components/Topbar/ThemeToggle.tsx`
- ✅ `resources/js/Components/Topbar/index.tsx`

---

## FASE 4: Layout Principal ✅

### Tarefas:
- [x] AuthenticatedLayout (`resources/js/Layouts/AuthenticatedLayout.tsx`)
  - Estrutura: Sidebar + Main Content
  - Main: Topbar + Content
  - Margin-left dinâmica (ml-16/ml-64)
  - Integrar ThemeProvider
  - Integrar WalletProvider
  - Integrar SidebarProvider
  - Toggle do sidebar na topbar
  - WalletSelector na topbar
  - Botão de menu hamburger (Bars3Icon)

**Modificações:**
- ✅ `resources/js/Layouts/AuthenticatedLayout.tsx` - Reescrito completamente
- ✅ `resources/js/Layouts/GuestLayout.tsx` - Cores atualizadas

---

## FASE 5: Configuração de Navegação ✅

### Tarefas:
- [x] Navigation Config (`resources/js/lib/navigation.ts`)
  - Definição dos menus com rotas nomeadas
  - Ícones do Heroicons associados
  - Submenus com items filhos
  - Badges iniciais

**Menus configurados:**
- ✅ Dashboard (HomeIcon)
- ✅ Wallets (WalletIcon) - Submenu: All Wallets, Create New
- ✅ Portfolios (FolderIcon) - Submenu: All Portfolios
- ✅ Transactions (ArrowsRightLeftIcon)
- ✅ Positions (ClipboardDocumentListIcon)
- ✅ Reports (DocumentChartBarIcon)
- ✅ Assets (BriefcaseIcon)
- ✅ Banks & Brokers (BuildingLibraryIcon)
- ✅ Settings (Cog6ToothIcon)

**Arquivo criado:**
- ✅ `resources/js/lib/navigation.ts`

---

## FASE 6: Tipos TypeScript ✅

### Tarefas:
- [x] Atualizar `resources/js/types/index.ts`
  - MenuItem interface
  - SubmenuItem interface
  - MenuSection interface
  - UpdateProfileFormData (adicionado phone, birthday)

**Interfaces adicionadas:**
```typescript
interface MenuItem {
  label: string;
  href: string;
  routeName?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface SubmenuItem extends MenuItem {
  children?: MenuItem[];
}

interface MenuSection {
  header?: string;
  items: SubmenuItem[];
}
```

**Arquivo modificado:**
- ✅ `resources/js/types/index.ts`

---

## FASE 7: Ajustes nas Páginas ✅

### Tarefas:
- [x] Dashboard - Remover padding extra, usar title no layout
- [x] Wallets/Index - Ajustar layout, usar title no layout
- [x] Wallets/Show - Ajustar layout
- [x] Portfolios/Index - Ajustar layout, usar title no layout
- [x] Portfolios/Edit - Ajustar layout, usar title no layout
- [x] Profile/Edit - Ajustar layout, usar title no layout, usar Card

**Páginas modificadas:**
- ✅ `resources/js/Pages/Dashboard.tsx`
- ✅ `resources/js/Pages/Wallet/Index.tsx`
- ✅ `resources/js/Pages/Portfolio/Edit.tsx`
- ✅ `resources/js/Pages/Profile/Edit.tsx`

---

## FASE 8: Componentes Atualizados para Dark Mode ✅

### Tarefas:
- [x] Card.tsx - Fundo, bordas e textos com CSS variables
- [x] PrimaryButton.tsx - Cores de accent e hover
- [x] SecondaryButton.tsx - Fundo e bordas dinâmicas
- [x] TextInput.tsx - Fundo, texto e focus dinâmicos
- [x] InputLabel.tsx - Cor de texto secundária
- [x] InputError.tsx - Vermelho ajustado
- [x] DataTable.tsx - Fundo, bordas e textos dinâmicos
- [x] Dropdown.tsx - Fundo (--sidebar-bg) e textos
- [x] Modal.tsx - Fundo do overlay e painel dinâmicos
- [x] FormInputBase.tsx - Background dos labels ajustado
- [x] WalletSelector.tsx - Cores padronizadas

**Arquivos modificados:**
- ✅ Todos os componentes em `resources/js/Components/`

---

## Paleta de Cores Final

### Dark Mode
```css
--sidebar-bg: #0f172a
--sidebar-hover: #1e293b
--sidebar-active: #1e3a8a      /* Azul mais escuro para melhor contraste */
--sidebar-border: #334155
--content-bg: #0f172a
--card-bg: #1e293b
--text-primary: #f1f5f9
--text-secondary: #94a3b8
--text-muted: #64748b
--border-color: #334155
--accent-color: #3b82f6
--accent-hover: #60a5fa
```

### Light Mode
```css
--sidebar-bg: #ffffff
--sidebar-hover: #e2e8f0       /* Ajustado para melhor contraste */
--sidebar-active: #dbeafe      /* Azul claro */
--content-bg: #f8fafc
--card-bg: #ffffff
--text-primary: #0f172a
--text-secondary: #475569
--text-muted: #94a3b8
--border-color: #e2e8f0
--accent-color: #3b82f6
--accent-hover: #2563eb
```

---

## Checklist de Implementação

### Phase 1: Theme System ✅
- [x] ThemeContext criado
- [x] Tailwind configurado
- [x] CSS variables definidas

### Phase 2: Sidebar Components ✅
- [x] SidebarContext criado
- [x] Sidebar container criado
- [x] SidebarItem criado
- [x] SidebarSubmenu criado
- [x] SidebarSection criado
- [x] Submenu com animações implementado
- [x] Gerenciamento de submenu ativo implementado
- [x] Delay ao esconder submenu implementado

### Phase 3: Topbar Components ✅
- [x] Topbar container criado
- [x] TopbarIconWithBadge criado
- [x] UserMenu criado
- [x] ThemeToggle criado

### Phase 4: Layout Integration ✅
- [x] AuthenticatedLayout reescrito
- [x] Providers integrados (Theme, Wallet, Sidebar)
- [x] Toggle do sidebar na topbar
- [x] WalletSelector na topbar

### Phase 5: Navigation ✅
- [x] Config de navegação criada
- [x] Menu items definidos
- [x] Rotas nomeadas implementadas
- [x] Ícones configurados

### Phase 6: Types ✅
- [x] Interfaces atualizadas
- [x] MenuItem interface
- [x] SubmenuItem interface
- [x] MenuSection interface

### Phase 7: Pages ✅
- [x] Dashboard ajustado
- [x] Wallets ajustado
- [x] Portfolios ajustado
- [x] Profile ajustado

### Phase 8: Dark Mode ✅
- [x] Todos os componentes atualizados
- [x] Variáveis CSS aplicadas
- [x] Cores padronizadas

---

## Pendências / Melhorias Futuras

### Mobile Responsivo ⚠️
- [ ] Sidebar se torna drawer em telas pequenas
- [ ] Menu hamburguer no mobile
- [ ] Touch-friendly targets (min 44px)
- [ ] Ajuste de layout para telas pequenas
- [ ] Swipe gestures para abrir/fechar sidebar

### Possíveis Melhorias
- [ ] Animações mais suaves no mobile
- [ ] Compactação automática em telas médias
- [ ] Persistência do estado dos submenus expandidos
- [ ] Keyboard shortcuts para navegação

---

## Bugs Corrigidos

1. ✅ **Sidebar colapsado com barra de rolagem** - Ajustado padding e overflow
2. ✅ **Submenu não acessível no collapsed** - Implementado dropdown flutuante
3. ✅ **Dropdowns sobrepostos** - Gerenciamento de estado global (activeSubmenu)
4. ✅ **Animação inconsistente** - useRef para controle de timeout e estado
5. ✅ **Cores diferentes nos dropdowns** - Padronização para --sidebar-bg
6. ✅ **Menu ativo sem hover visível** - Ajuste de cores (--sidebar-active mais claro)

---

## Testes Realizados

- [x] Toggle entre dark/light mode
- [x] Persistência do tema após reload
- [x] Colapso/expansão do sidebar
- [x] Submenus no estado expandido
- [x] Submenus no estado collapsed (dropdown)
- [x] Navegação entre páginas
- [x] Animações suaves
- [x] Hover states em todos os botões
- [x] Responsividade básica
- [ ] Mobile layout ⚠️ PENDENTE

---

## Conclusão

✅ **Task concluída com sucesso!**

O redesign da interface foi implementado completamente, proporcionando:
- Interface moderna e profissional
- Navegação intuitiva com sidebar colapsável
- Suporte completo a dark/light mode
- Animações suaves e responsivas
- Código modular e manutenível

**Única pendência:** Implementação do layout responsivo para mobile, que pode ser tratada em uma task separada futura.

---

## Notas

- Manter compatibilidade com Inertia.js ✅
- Usar Headless UI para componentes interativos ✅
- Tailwind CSS para estilização ✅
- Heroicons para ícones ✅
- React hooks para estado ✅
- TypeScript strict mode ✅
- CSS variables para theming ✅
