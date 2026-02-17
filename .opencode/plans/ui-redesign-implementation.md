# Plano de Implementação: Novo Design de Interface

## Objetivo
Atualizar o design da aplicação Wallet Invest para um layout moderno com menu lateral colapsável, topbar avançada, e suporte a dark/light mode.

## Status: ✅ CONCLUÍDO (Com exceção de mobile)

## Referência Visual
- Design baseado na imagem fornecida (dashboard com sidebar azul escuro)
- Menu lateral colapsável mantendo ícones
- Topbar com abas, botões e menu do usuário
- Suporte a dark mode (azul escuro) e light mode (branco/cinza)

---

## FASE 1: Sistema de Tema (Theme System) ✅

### 1.1 ThemeContext ✅
**Arquivo:** `resources/js/Contexts/ThemeContext.tsx`
- ✅ Gerenciamento de estado do tema (light/dark)
- ✅ Persistência no localStorage
- ✅ Detecção de preferência do sistema
- ✅ Hook useTheme() para acesso fácil

### 1.2 Configuração Tailwind ✅
**Arquivo:** `tailwind.config.js`
- ✅ Adicionar darkMode: 'class'
- ✅ Configurar cores customizadas para ambos os temas
- ✅ Variáveis CSS para cores dinâmicas

### 1.3 CSS Global ✅
**Arquivo:** `resources/css/app.css` (atualização)
- ✅ Definir variáveis CSS para:
  - Background (sidebar, content, cards)
  - Textos (primário, secundário, muted)
  - Bordas e divisores
  - Cores de destaque/accent
  - Estados (hover, active, focus)

---

## FASE 2: Componentes do Sidebar ✅

### 2.1 Estrutura Base ✅
**Arquivos:**
- ✅ `resources/js/Components/Sidebar/Sidebar.tsx` - Container principal
- ✅ `resources/js/Components/Sidebar/SidebarContext.tsx` - Estado de colapso

**Funcionalidades:**
- ✅ Largura expansível (64px colapsado, 256px expandido)
- ✅ Animação suave de transição
- ✅ Toggle de colapso/expandir

### 2.2 Itens de Menu ✅
**Arquivos:**
- ✅ `resources/js/Components/Sidebar/SidebarItem.tsx` - Item simples
- ✅ `resources/js/Components/Sidebar/SidebarSubmenu.tsx` - Item com submenu
- ✅ `resources/js/Components/Sidebar/SidebarSection.tsx` - Seção com header

**Props implementadas:**
```typescript
interface SidebarItemProps {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  active?: boolean;
  forceShowLabel?: boolean;
}
```

### 2.3 Submenu ✅
**Arquivo:** `resources/js/Components/Sidebar/SidebarSubmenu.tsx`

**Funcionalidades implementadas:**
- ✅ Expansão/recolhimento com animação
- ✅ Indicador visual de estado (seta rotacionável)
- ✅ Suporte a submenus no estado collapsed (dropdown flutuante)
- ✅ Animação de slide da esquerda para direita
- ✅ Gerenciamento de estado global (apenas um submenu aberto por vez)
- ✅ Delay de 300ms ao esconder para melhor UX

### 2.4 Seções ✅
**Arquivo:** `resources/js/Components/Sidebar/SidebarSection.tsx`

**Funcionalidades:**
- ✅ Cabeçalho opcional (ex: "Your teams")
- ✅ Agrupamento lógico de itens
- ✅ Suporte a estado collapsed

---

## FASE 3: Componentes da Topbar ✅

### 3.1 Estrutura Base ✅
**Arquivo:** `resources/js/Components/Topbar/Topbar.tsx`

**Funcionalidades:**
- ✅ Altura fixa (64px)
- ✅ Área para botões/ações
- ✅ Área para menu do usuário

### 3.2 Ações ✅
**Arquivos:**
- ✅ `resources/js/Components/Topbar/TopbarIconWithBadge.tsx` - Ícone com badge

### 3.3 Menu do Usuário ✅
**Arquivo:** `resources/js/Components/Topbar/UserMenu.tsx`

**Funcionalidades:**
- ✅ Avatar com fallback (primeira letra do nome)
- ✅ Dropdown com: Profile, Logout
- ✅ Hover states
- ✅ Cores padronizadas com sidebar

### 3.4 Toggle de Tema ✅
**Arquivo:** `resources/js/Components/Topbar/ThemeToggle.tsx`

**Funcionalidades:**
- ✅ Ícone sol/lua
- ✅ Toggle entre temas

### 3.5 Wallet Selector ✅
**Arquivo:** `resources/js/Components/WalletSelector.tsx`

**Funcionalidades:**
- ✅ Dropdown de seleção de carteira
- ✅ Lista de carteiras do usuário
- ✅ Link para criar nova carteira
- ✅ Cores padronizadas com sidebar

---

## FASE 4: Layout Principal ✅

### 4.1 AuthenticatedLayout ✅
**Arquivo:** `resources/js/Layouts/AuthenticatedLayout.tsx` (reescrita)

**Estrutura:**
```
<ThemeProvider>
  <WalletProvider>
    <SidebarProvider>
      <div class="flex h-screen">
        <Sidebar />
        <div class="flex-1 flex flex-col ml-16/64">
          <Topbar />
          <main class="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  </WalletProvider>
</ThemeProvider>
```

**Funcionalidades:**
- ✅ Sidebar fixo à esquerda
- ✅ Main content com margin-left dinâmica
- ✅ Topbar sticky
- ✅ Integração com todos os providers

---

## FASE 5: Configuração de Navegação ✅

### 5.1 Navigation Config ✅
**Arquivo:** `resources/js/lib/navigation.ts`

**Implementações:**
- ✅ Definição dos menus com rotas nomeadas
- ✅ Ícones do Heroicons associados
- ✅ Submenus com items filhos
- ✅ Suporte a badges

**Menus configurados:**
- ✅ Dashboard
- ✅ Wallets (com submenu: All Wallets, Create New)
- ✅ Portfolios (com submenu: All Portfolios)
- ✅ Transactions
- ✅ Positions
- ✅ Reports
- ✅ Assets
- ✅ Banks & Brokers
- ✅ Settings

---

## FASE 6: Tipos TypeScript ✅

### 6.1 Atualizar types/index.ts ✅
**Novas interfaces adicionadas:**
```typescript
interface MenuItem {
  label: string;
  href: string;
  routeName?: string;
  icon?: React.ComponentType;
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

---

## FASE 7: Componentes Atualizados para Dark Mode ✅

### 7.1 Componentes Core ✅
- ✅ `Card.tsx` - Fundo, bordas e textos com CSS variables
- ✅ `PrimaryButton.tsx` - Cores de accent e hover
- ✅ `SecondaryButton.tsx` - Fundo e bordas dinâmicas
- ✅ `TextInput.tsx` - Fundo, texto e focus dinâmicos
- ✅ `InputLabel.tsx` - Cor de texto secundária
- ✅ `InputError.tsx` - Vermelho ajustado
- ✅ `DataTable.tsx` - Fundo, bordas e textos
- ✅ `Dropdown.tsx` - Fundo e textos
- ✅ `Modal.tsx` - Fundo do overlay e painel
- ✅ `FormInputBase.tsx` - Background dos labels ajustado

### 7.2 Páginas Atualizadas ✅
- ✅ Dashboard - Usa title no layout
- ✅ Wallets/Index - Layout ajustado
- ✅ Wallets/Show - Layout ajustado
- ✅ Portfolios/Index - Layout ajustado
- ✅ Portfolios/Edit - Layout ajustado
- ✅ Profile/Edit - Layout ajustado
- ✅ GuestLayout - Fundo e card dinâmicos

---

## Paleta de Cores (Implementada)

### Dark Mode
```css
--sidebar-bg: #0f172a          /* Azul escuro sidebar */
--sidebar-hover: #1e293b       /* Hover no menu */
--sidebar-active: #1e3a8a      /* Item ativo (azul mais escuro) */
--content-bg: #0f172a          /* Background conteúdo */
--card-bg: #1e293b             /* Background cards */
--text-primary: #f1f5f9        /* Texto principal (branco) */
--text-secondary: #94a3b8      /* Texto secundário (cinza claro) */
--text-muted: #64748b          /* Texto muted */
--border-color: #334155        /* Bordas/divisores */
--accent-color: #3b82f6        /* Cor de destaque (azul) */
--accent-hover: #60a5fa        /* Hover do accent */
```

### Light Mode
```css
--sidebar-bg: #ffffff          /* Branco sidebar */
--sidebar-hover: #e2e8f0       /* Hover */
--sidebar-active: #dbeafe      /* Item ativo (azul claro) */
--content-bg: #f8fafc          /* Background conteúdo */
--card-bg: #ffffff             /* Background cards */
--text-primary: #0f172a        /* Texto principal */
--text-secondary: #475569      /* Texto secundário */
--text-muted: #94a3b8          /* Texto muted */
--border-color: #e2e8f0        /* Bordas/divisores */
--accent-color: #3b82f6        /* Cor de destaque */
--accent-hover: #2563eb        /* Hover do accent */
```

---

## Arquivos Criados/Modificados

### Novos Arquivos
```
resources/js/
├── Contexts/
│   └── ThemeContext.tsx
├── Components/
│   ├── Sidebar/
│   │   ├── SidebarContext.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SidebarItem.tsx
│   │   ├── SidebarSubmenu.tsx
│   │   ├── SidebarSection.tsx
│   │   └── index.tsx
│   └── Topbar/
│       ├── Topbar.tsx
│       ├── TopbarIconWithBadge.tsx
│       ├── UserMenu.tsx
│       ├── ThemeToggle.tsx
│       └── index.tsx
├── lib/
│   └── navigation.ts
```

### Arquivos Modificados
```
resources/js/
├── Layouts/
│   ├── AuthenticatedLayout.tsx
│   └── GuestLayout.tsx
├── Components/
│   ├── Card.tsx
│   ├── PrimaryButton.tsx
│   ├── SecondaryButton.tsx
│   ├── TextInput.tsx
│   ├── InputLabel.tsx
│   ├── InputError.tsx
│   ├── DataTable.tsx
│   ├── Dropdown.tsx
│   ├── Modal.tsx
│   ├── FormInputBase.tsx
│   └── WalletSelector.tsx
├── Pages/
│   ├── Dashboard.tsx
│   ├── Wallet/Index.tsx
│   ├── Portfolio/Edit.tsx
│   └── Profile/Edit.tsx
├── css/
│   └── app.css
└── tailwind.config.js
```

---

## Critérios de Aceitação

- [x] Menu lateral colapsa e expande suavemente
- [x] Ícones permanecem visíveis quando colapsado
- [x] Submenus abrem com animação suave
- [x] Dark/light mode funciona em toda a aplicação
- [x] Avatar mostra imagem ou primeira letra do nome
- [x] Badges aparecem corretamente nos itens
- [x] Tema persiste entre recarregamentos
- [ ] Layout responsivo funciona em mobile ⚠️ PENDENTE
- [x] Todas as páginas existentes continuam funcionando

---

## Pendências / Melhorias Futuras

### Mobile Responsivo
- [ ] Sidebar se torna drawer em telas pequenas
- [ ] Menu hamburguer no mobile
- [ ] Touch-friendly targets (min 44px)
- [ ] Ajuste de layout para telas pequenas

### Possíveis Melhorias
- [ ] Animações mais suaves no mobile
- [ ] Suporte a gestos de swipe
- [ ] Compactação automática em telas médias

---

## Notas Técnicas

### Performance
- ✅ React hooks para estado
- ✅ CSS transitions para animações
- ✅ Lazy loading onde aplicável
- ✅ useMemo/useCallback onde necessário

### Acessibilidade
- ✅ ARIA labels em botões
- ✅ Estados de foco visíveis
- ✅ Contraste adequado em ambos os temas
- ✅ Suporte a navegação por teclado

### Padrões Implementados
- ✅ Context API para estado global
- ✅ Custom hooks (useSidebar, useTheme)
- ✅ Componentes compostos (Dropdown)
- ✅ TypeScript strict mode
- ✅ CSS variables para theming

---

## Conclusão

O redesign da interface foi implementado com sucesso, proporcionando:
- ✅ Interface moderna e profissional
- ✅ Navegação intuitiva com sidebar colapsável
- ✅ Suporte completo a dark/light mode
- ✅ Animações suaves e responsivas
- ✅ Código modular e manutenível

**Única pendência:** Implementação do layout responsivo para mobile.
