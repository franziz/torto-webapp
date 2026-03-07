# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Design Language

See [docs/DESIGN_LANGUAGE.md](docs/DESIGN_LANGUAGE.md) for the full UI/UX design system — color tokens, typography, component usage, layout patterns, and interaction guidelines. **Always consult this file before building or modifying UI.**

## Commands

```bash
npm run dev          # Start dev server on port 13001 (Next.js + Turbopack)
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint
npm run test:e2e     # Playwright end-to-end tests
npm run test:e2e:ui  # Playwright tests with UI mode
```

E2e tests live in `e2e/`. Playwright config: `playwright.config.ts`.

## Tech Stack

- **Next.js 15** (App Router) / **React 19** / **TypeScript 5** (strict)
- **Tailwind CSS 4** with `prettier-plugin-tailwindcss` for class sorting
- **Clerk** for authentication (middleware + session management)
- **SWR** for client-side data fetching
- **Luxon** for dates, **Joi** for validation

## Architecture

Clean Architecture with feature-based modules. Three layers per feature:

```
src/
├── app/                              # Next.js pages & layouts
│   ├── (authenticated)/              # Protected routes (Clerk)
│   └── (authentication)/             # Sign-in
├── features/{feature}/               # Feature modules
│   ├── domain/                       # Entities, repository interfaces, use cases
│   ├── data/                         # Repository impls, services, models
│   └── presentation/                 # Hooks, components, providers
└── core/                             # Shared utilities, base classes, global components
```

### Data Flow

**Use case → Repository (interface) → Repository impl → Service (HTTP) → API**

Hooks wrap use cases with SWR:
```
useListItems → SWR fetcher → ListItemsUseCase → ItemRepositoryImpl → ItemServiceImpl → HTTP
```

### Features

`account`, `asset`, `asset-type`, `authentication`, `currency`, `item`, `portfolio`, `position`, `transaction`, `transaction-type`

### Routes (authenticated)

`/home` (dashboard), `/activity`, `/items`, `/settings`

### Key Patterns

- **Base classes** (`core/resources/`): `AbstractEntity`, `AbstractModel`, `UseCase<ReturnValue, Params>`
- **DataState pattern**: Use cases return `DataSuccess<T>` or `DataFailed` instead of throwing
- **Hook return types**: Discriminated unions (`InitialState | LoadedState | ErrorState`)
- **ServerError + ErrorCodes**: Centralized error registry
- **Impl components**: `*-impl.tsx` files are smart components that fetch data and pass to presentational siblings

### HTTP Requests

Custom `HttpRequest` class injects Clerk session headers:
- `Authorization: Bearer {token}`
- `X-Account-Id: {accountId}`
- Base URL from `NEXT_PUBLIC_BASE_API_URL`

## Conventions

### Imports

Always use `@/` path alias (maps to `src/`). No relative imports.

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Use cases | `{verb}-{noun}.usecases.ts` | `list-items.usecases.ts` |
| Hooks | `use-{verb}-{noun}.ts` | `use-list-items.ts` |
| Hook types | `use-{verb}-{noun}.types.ts` | `use-list-items.types.ts` |
| Entities | `{noun}.ts` | `item.ts` |
| Repo interfaces | `domain/repositories/{noun}.ts` | `item.ts` |
| Repo impls | `data/repositories/{noun}.ts` | `item.ts` |
| Services | `data/sources/{noun}.ts` | `item.ts` |
| Service interfaces | `domain/sources/{noun}.ts` | `item.ts` |

Directories use kebab-case. Components use kebab-case filenames.

### Environment

Copy `.env.example` to `.env.local`. Required vars: `NEXT_PUBLIC_BASE_API_URL`, Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`).

### Code Style

- Prettier: 2-space indent, 120 char width
- `@typescript-eslint/no-explicit-any` is disabled
- Domain layer must not import from data or presentation layers
  - **Exception**: `domain/sources/` service interfaces return `*Model` types from `data/models/` — this is intentional

### Git

- Branch naming: `features/{description}` for new features
- Always create branches from `dev`
- Commit messages: conventional commits — `type(scope): description` (e.g., `feat(dashboard):`, `fix(ui):`, `refactor(api):`)
