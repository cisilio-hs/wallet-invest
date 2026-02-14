# AGENTS.md - Wallet Invest

## 🎯 Project Purpose: Smart Portfolio Allocator

An intelligent investment portfolio management system that helps investors make data-driven buy decisions using value investing principles combined with dynamic asset allocation.

### How It Works

**Core Architecture:**
```
Person → Wallet → Portfolio → Assets
```

**Portfolio**: User-created container with:
- Custom name (e.g., "FIIs-tijolo", "Ações BR", "Internacional")
- Target weight % of total wallet (e.g., 30%, 25%)
- Independent scoring questions
- Multiple assets

**Asset**: Belongs to exactly one Portfolio
- Ticker symbol (unique per wallet)
- Type: `stock`, `fii`, `bond`, `crypto`, `reit`
- Current price (manually entered)
- Quantity held
- Score: 0 to Max (sum of question answers)

**Scoring System**:
- User creates Yes/No questions per portfolio (e.g., "DY >= 8%?", "CAGR >= 5%?")
- Yes = +1 point, No = -1 point
- Asset Score = sum of all answers
- **Assets with score ≤ 0 are excluded from buy recommendations**
- Asset Weight within Portfolio = Asset Score / Sum of all Assets Scores

**Investment Recommendation Engine**:
- Input: Available capital (e.g., "I have R$ 5,000 to invest")
- System calculates portfolio drift from target weights
- Prioritizes under-allocated portfolios
- Within each portfolio, distributes by asset score weight
- Output: Ranked buy suggestions
  - BR assets: integer shares only (3, 5, 10)
  - US assets: fractional shares OK (0.123, 5.5)

### Asset Types (for future integrations)
- `stock`: B3 (BR), NASDAQ/NYSE (US)
- `fii`: Fundos Imobiliários (BR)
- `bond`: CDB, LCI, LCA (BR), Treasury Bonds (US)
- `crypto`: Bitcoin, Ethereum, etc.
- `reit`: Real Estate Investment Trusts (US)

### Wallet Assets - Listed vs Unlisted

**Listed Assets** (from global assets table):
- Use `asset_id` foreign key
- Have ticker symbols (ABEV3, PETR4, AAPL)
- Pulled from B3, NASDAQ, etc.

**Unlisted Assets** (custom per user):
- Use `custom_name` field
- Examples: "Physical Gold", "CDB Nubank", "BTC Wallet"
- Scoped to user's wallet only
- Not in global assets table

**Rules:**
- Either `asset_id` OR `custom_name` must be present, never both
- Same wallet cannot have duplicate entries
- Both types support quantity and average_price tracking

### Current Scope
- ✅ TypeScript migration completed
- ✅ PHP 8.5 with model annotations
- ✅ Pest testing setup
- ✅ Action Layer architecture implemented (Web/API ready)
- 📋 Scoring system & recommendation engine (planned)
- 🔮 GoogleFinance API integration (future)
- 🔮 Transaction history tracking (future)

---

Guidelines for AI coding agents working on this Laravel + React investment portfolio application.

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.5) with Inertia.js
- **Frontend**: React 18 + TypeScript + Tailwind CSS 3
- **Auth**: Laravel Breeze + Sanctum
- **Testing**: Pest (preferred) or PHPUnit
- **Docker**: PHP 8.5-fpm-alpine

## Build & Development Commands

```bash
# Setup (install dependencies, migrate, build)
composer setup

# Development (runs Laravel, queue, logs, and Vite concurrently)
composer dev

# PHP Code formatting/linting (Laravel Pint)
./vendor/bin/pint
./vendor/bin/pint --test        # Check without fixing

# Testing with Pest (preferred)
./vendor/bin/pest                                    # Run all tests
./vendor/bin/pest tests/Feature/WalletTest.php       # Run single file
./vendor/bin/pest --filter="displays the profile"    # Run by description
./vendor/bin/pest --parallel                         # Run in parallel
./vendor/bin/pest --watch                            # Watch mode
./vendor/bin/pest --coverage                         # With coverage

# Testing with PHPUnit (legacy)
php artisan test
php artisan test --filter=AuthenticationTest
php artisan test --filter=test_login_screen_can_be_rendered

# Frontend
npm run dev                     # Vite dev server
npm run build                   # Production build
```

## Project Structure

### Backend (PHP 8.5)
- `app/Actions/` - **Business logic layer** (reusable by Web/API)
  - `Wallets/` - Wallet-related actions (CreateWallet, UpdateWallet, etc.)
  - `Portfolios/` - Portfolio-related actions (CreatePortfolio, etc.)
- `app/Http/Controllers/Web/` - Web controllers (Inertia responses)
- `app/Http/Controllers/Api/` - Future: API controllers (JSON responses)
- `app/Models/` - Eloquent models with relationships
- `app/Policies/` - Authorization policies
- `app/Http/Requests/` - Form request validation
- `routes/web.php` - Web routes
- `database/factories/` - Model factories for testing

### Action Layer Pattern
**Purpose**: Separate business logic from transport layer (HTTP) for reusability across Web and future API/Mobile.

**Structure:**
```php
// app/Actions/Wallets/CreateWallet.php
class CreateWallet
{
    public function execute(User $user, string $name): Wallet
    {
        return Wallet::create([
            'person_id' => $user->person->id,
            'name' => $name,
        ]);
    }
}

// app/Http/Controllers/Web/WalletController.php
public function store(StoreWalletRequest $request, CreateWallet $createWallet)
{
    $this->authorize('create', Wallet::class);
    
    $createWallet->execute(
        user: $request->user(),
        name: $request->name
    );
    
    return redirect()->route('wallets.index');
}
```

**Guidelines:**
- Actions contain pure business logic (no HTTP/response handling)
- Controllers handle authorization, HTTP requests, and responses
- Actions are injectable via Laravel's DI container
- Same Actions can be reused by API controllers for mobile app

### Frontend (React + TypeScript)
- `resources/js/Pages/` - Page components (Inertia)
- `resources/js/Components/` - Reusable components
- `resources/js/Layouts/` - Page layouts
- `resources/js/Contexts/` - React contexts

### Frontend (React + TypeScript)
- `resources/js/Pages/` - Page components (Inertia)
- `resources/js/Components/` - Reusable components
- `resources/js/Layouts/` - Page layouts
- `resources/js/Contexts/` - React contexts

## PHP Code Style (PHP 8.5)

### Type Declarations
- Always use type hints on methods and properties
- Use union types where appropriate: `function foo(string|int $bar): void`
- Return types required: `public function index(): Response`
- Use `readonly` properties where applicable (PHP 8.1+)
- Nullable types: `?string` or `string|null`

### Naming Conventions
- **Classes**: PascalCase (e.g., `WalletController`)
- **Methods/Functions**: camelCase (e.g., `updatePortfolio`)
- **Variables**: camelCase (e.g., `$walletId`)
- **Constants**: UPPER_SNAKE_CASE
- **Database columns**: snake_case (e.g., `person_id`)
- **Routes**: plural resources (e.g., `wallets`, `portfolios`)
- **Pest tests**: descriptive sentences in quotes (e.g., `it('can create a wallet')`)

### Laravel Patterns
```php
// Controllers: Use dependency injection and authorization
public function store(StoreWalletRequest $request): RedirectResponse
{
    $this->authorize('create', Wallet::class);
    
    Wallet::create([
        'person_id' => $request->user()->person->id,
        'name' => $request->name,
    ]);
    
    return redirect()->route('wallets.index');
}

// Models: Use $fillable, not $guarded
protected $fillable = [
    'person_id',
    'name',
];

// Policies: Check ownership
public function update(User $user, Wallet $wallet): bool
{
    return $wallet->person_id === $user->person->id;
}
```

## TypeScript/React Code Style

### Type Safety
- **Strict mode enabled** - no implicit any
- Define props types explicitly: `type ComponentProps = { ... }`
- Use `React.ReactNode` for children
- Type aliases over interfaces for component props
- Avoid `any` - use `unknown` if type is uncertain

### Naming Conventions
- **Components**: PascalCase (e.g., `WalletSelector`)
- **Props types**: PascalCase with `Props` suffix (e.g., `CardProps`)
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### Component Structure
```tsx
// 1. Imports
import { useState } from 'react';
import { useForm } from '@inertiajs/react';

// 2. Type definitions
type WalletProps = {
    wallet: Wallet;
    onUpdate: (wallet: Wallet) => void;
};

// 3. Component with default export
export default function WalletCard({ wallet, onUpdate }: WalletProps) {
    // Component logic
    
    return (
        // JSX
    );
}
```

### Import Order
1. React imports
2. Third-party libraries (@inertiajs, @heroicons/react)
3. Internal aliases (@/Components, @/Layouts, @/Contexts)
4. Relative imports (./, ../)

### Inertia.js Patterns
```tsx
// Forms
const form = useForm({
    name: '',
    currency: ''
});

// Submission
form.post(route('wallets.store'), {
    onSuccess: () => form.reset()
});

// Accessing page props
const { auth } = usePage().props;

// Route helper (from Ziggy)
route('wallets.index');
```

## Testing with Pest (Preferred)

### Pest Conventions
```php
<?php
// tests/Feature/WalletTest.php

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('can list user wallets', function () {
    Wallet::factory()->count(3)->create([
        'person_id' => $this->user->person_id,
    ]);

    $response = $this->getJson('/wallets');

    expect($response)
        ->assertOk()
        ->assertJsonCount(3, 'wallets');
});

it('cannot access other users wallets', function () {
    $otherWallet = Wallet::factory()->create();

    $response = $this->getJson("/wallets/{$otherWallet->id}");

    expect($response)->assertForbidden();
});

// Group related tests
describe('Portfolio Management', function () {
    it('can create a portfolio within a wallet', function () {
        // Test implementation
    });
    
    it('validates portfolio name is required', function () {
        // Test implementation
    });
});
```

### Testing Best Practices
- Use factories for test data
- Group related tests with `describe()`
- Use `beforeEach()` for common setup
- Prefer `expect()` assertions over `$this->assert*()`
- Test both success and failure cases
- Use `RefreshDatabase` trait in feature tests

## Formatting (.editorconfig)

```
charset = utf-8
end_of_line = lf
indent_size = 4
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.{yml,yaml}]
indent_size = 2
```

## Authorization

- Always authorize controller actions: `$this->authorize('action', $model)`
- Policies check ownership via `person_id` relationship
- User model has `person()` relationship
- Policies return `bool` for gates, `Response` for custom messages

## Error Handling

- **PHP**: Use Laravel's validation (Form Requests) for input validation
- **React**: Use Inertia's `form.errors` for displaying validation errors
- Display errors with `InputError` component

## Common Tasks

**Add new page**: Create component in `resources/js/Pages/`, add route in `routes/web.php`
**Add new model**: Create model + migration + factory + seeder + policy
**Add new API endpoint**: Add to `routes/api.php` or use resource controller
**Form validation**: Create Form Request class, type-hint in controller
**Run single test**: `./vendor/bin/pest --filter="test description"`
**Run coverage**: `./vendor/bin/pest --coverage --min=80`

## Task Documentation Convention

When creating task summary files (e.g., after completing a migration or major feature), save them to:

```
./opencode/tasks/YYYY_MM_DD_HHMMSS_DESCRIPTIVE_NAME.md
```

**Format (similar to Laravel migrations):**
- `YYYY_MM_DD` - Date (Year_Month_Day)
- `HHMMSS` - Time (Hour_Minute_Second)
- `DESCRIPTIVE_NAME` - Uppercase with underscores

**Examples:**
- `2026_02_11_132536_MIGRATION_SUMMARY.md`
- `2026_02_12_090000_AUTH_SYSTEM_REFACTOR.md`
- `2026_02_13_143000_WALLET_API_IMPLEMENTATION.md`

This ensures chronological ordering and easy reference to past work.

## Database

- SQLite in-memory for testing (`:memory:`)
- MySQL/PostgreSQL for development/production
- Use migrations for schema changes
- Use factories for seeding test data
- Relationships: Use eager loading with `->load()` to avoid N+1

## Docker Environment

- PHP 8.5-fpm-alpine
- User runs as non-root (`appuser`)
- Working directory: `/var/www`
- UID/GID passed from host for permission compatibility

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.5.2
- inertiajs/inertia-laravel (INERTIA) - v2
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- laravel/pulse (PULSE) - v1
- laravel/sanctum (SANCTUM) - v4
- livewire/livewire (LIVEWIRE) - v4
- tightenco/ziggy (ZIGGY) - v2
- laravel/breeze (BREEZE) - v2
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- phpunit/phpunit (PHPUNIT) - v11
- @inertiajs/react (INERTIA) - v2
- react (REACT) - v18
- tailwindcss (TAILWINDCSS) - v3

## Skills Activation

This project has domain-specific skills available. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

- `inertia-react-development` — Develops Inertia.js v2 React client-side applications. Activates when creating React pages, forms, or navigation; using &lt;Link&gt;, &lt;Form&gt;, useForm, or router; working with deferred props, prefetching, or polling; or when user mentions React with Inertia, React pages, React forms, or React navigation.
- `tailwindcss-development` — Styles applications using Tailwind CSS v3 utilities. Activates when adding styles, restyling components, working with gradients, spacing, layout, flex, grid, responsive design, dark mode, colors, typography, or borders; or when the user mentions CSS, styling, classes, Tailwind, restyle, hero section, cards, buttons, or any visual/UI changes.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan

- Use the `list-artisan-commands` tool when you need to call an Artisan command to double-check the available parameters.

## URLs

- Whenever you share a project URL with the user, you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain/IP, and port.

## Tinker / Debugging

- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.
- Use the `database-schema` tool to inspect table structure before writing migrations or models.

## Reading Browser Logs With the `browser-logs` Tool

- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)

- Boost comes with a powerful `search-docs` tool you should use before trying other approaches when working with Laravel or Laravel ecosystem packages. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic-based queries at once. For example: `['rate limiting', 'routing rate limiting', 'routing']`. The most relevant results will be returned first.
- Do not add package names to queries; package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'.
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit".
3. Quoted Phrases (Exact Position) - query="infinite scroll" - words must be adjacent and in that order.
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit".
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms.

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.

## Constructors

- Use PHP 8 constructor property promotion in `__construct()`.
    - `public function __construct(public GitHub $github) { }`
- Do not allow empty `__construct()` methods with zero parameters unless the constructor is private.

## Type Declarations

- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<!-- Explicit Return Types and Method Params -->
```php
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
```

## Enums

- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.

## Comments

- Prefer PHPDoc blocks over inline comments. Never use comments within the code itself unless the logic is exceptionally complex.

## PHPDoc Blocks

- Add useful array shape type definitions when appropriate.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/Pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

=== inertia-laravel/v2 rules ===

# Inertia v2

- Use all Inertia features from v1 and v2. Check the documentation before making changes to ensure the correct approach.
- New features: deferred props, infinite scrolling (merging props + `WhenVisible`), lazy loading on scroll, polling, prefetching.
- When using deferred props, add an empty state with a pulsing or animated skeleton.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

## Database

- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries.
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## Controllers & Validation

- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

## Authentication & Authorization

- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Queues

- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

## Configuration

- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== laravel/v12 rules ===

# Laravel 12

- CRITICAL: ALWAYS use `search-docs` tool for version-specific Laravel documentation and updated code examples.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

## Laravel 12 Structure

- In Laravel 12, middleware are no longer registered in `app/Http/Kernel.php`.
- Middleware are configured declaratively in `bootstrap/app.php` using `Application::configure()->withMiddleware()`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- The `app\Console\Kernel.php` file no longer exists; use `bootstrap/app.php` or `routes/console.php` for console configuration.
- Console commands in `app/Console/Commands/` are automatically available and do not require manual registration.

## Database

- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 12 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models

- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.

=== pint/core rules ===

# Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== phpunit/core rules ===

# PHPUnit

- This application uses PHPUnit for testing. All tests must be written as PHPUnit classes. Use `php artisan make:test --phpunit {name}` to create a new test.
- If you see a test using "Pest", convert it to PHPUnit.
- Every time a test has been updated, run that singular test.
- When the tests relating to your feature are passing, ask the user if they would like to also run the entire test suite to make sure everything is still passing.
- Tests should cover all happy paths, failure paths, and edge cases.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files; these are core to the application.

## Running Tests

- Run the minimal number of tests, using an appropriate filter, before finalizing.
- To run all tests: `php artisan test --compact`.
- To run all tests in a file: `php artisan test --compact tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --compact --filter=testName` (recommended after making a change to a related file).

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

=== tailwindcss/core rules ===

# Tailwind CSS

- Always use existing Tailwind conventions; check project patterns before adding new ones.
- IMPORTANT: Always use `search-docs` tool for version-specific Tailwind CSS documentation and updated code examples. Never rely on training data.
- IMPORTANT: Activate `tailwindcss-development` every time you're working with a Tailwind CSS or styling-related task.
</laravel-boost-guidelines>
