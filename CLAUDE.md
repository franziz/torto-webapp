# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js + Turbopack)
npm run build        # Production build
npm run lint         # ESLint
```

No test framework is configured.

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

### Key Patterns

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

Directories use kebab-case. Components use kebab-case filenames.

### Code Style

- Prettier: 2-space indent, 120 char width
- `@typescript-eslint/no-explicit-any` is disabled
- Domain layer must not import from data or presentation layers

### Git

- Branch naming: `features/{description}` for new features
- Always create branches from `dev`
