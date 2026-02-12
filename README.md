# Wallet Invest

Smart Portfolio Allocator for Value Investing

## Overview

Wallet Invest is an intelligent investment portfolio management system that helps investors make data-driven buy decisions using value investing principles combined with dynamic asset allocation.

### Key Features

- **Portfolio Management**: Create custom portfolios with target allocation weights
- **Asset Scoring**: Define custom scoring questions per portfolio to evaluate assets
- **Smart Recommendations**: Get buy recommendations based on available capital and scoring weights
- **Multi-Wallet Support**: Manage multiple investment wallets independently
- **Asset Type Classification**: Support for stocks, FIIs, bonds, crypto, and REITs

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.5)
- **Frontend**: React 18 + TypeScript
- **Architecture**: Inertia.js with Action Layer pattern
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/cisilio-hs/wallet-invest.git
cd wallet-invest

# 2. Setup environment
cp .env.dev .env
# Edit .env and configure database credentials

# 3. Start containers
docker-compose up -d

# 4. Install dependencies
docker-compose exec app composer install
docker-compose exec vite npm install

# 5. Generate key
docker-compose exec app php artisan key:generate

# 6. Run migrations
docker-compose exec app php artisan migrate

# 7. Run Seeders
docker-compose exec app php artisan db:seed

# 8. Build frontend
docker-compose exec vite npm run build

# 9. Start development
docker-compose exec vite npm run dev
```

Access at: http://localhost:8000

## Development Commands

```bash
# Run tests
docker-compose exec app php artisan test

# Format PHP code
docker-compose exec app ./vendor/bin/pint

# Type check TypeScript
docker-compose exec vite npm run type-check

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## Project Structure

```
app/
├── Actions/             # Business logic (reusable for API/Mobile)
│   ├── Wallets/
│   └── Portfolios/
├── Http/
│   └── Controllers/
│       ├── Web/         # Web controllers (Inertia)
│       └── Api/         # Future: API controllers
├── Models/
├── Policies/
└── ...

resources/js/
├── Pages/              # Inertia page components
├── Components/         # Reusable React components
├── Contexts/           # React contexts
└── types/              # TypeScript type definitions
```

## Architecture

### Action Layer Pattern

Business logic is separated into Actions for reusability across Web and future API/Mobile:

- **Actions**: Contain pure business logic (no HTTP)
- **Web Controllers**: Handle HTTP requests, authorization, and responses
- **Future API Controllers**: Will reuse same Actions

### Data Model

```
Person → Wallet → Portfolio → Assets
         ↓
    Portfolio has custom scoring questions
    Assets have scoring answers
```

## License

MIT
