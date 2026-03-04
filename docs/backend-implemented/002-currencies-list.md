# Backend Implemented: `GET /api/currencies`

**Status:** Implemented
**Date:** 2026-03-03

## Endpoint

`GET /api/currencies`

### Auth

Bearer token required (same as other endpoints).

### Query Params

None.

### Response Shape

```json
{
  "data": [
    {
      "code": "IDR",
      "name": "Indonesian Rupiah",
      "symbol": "Rp"
    },
    {
      "code": "SGD",
      "name": "Singapore Dollar",
      "symbol": "S$"
    },
    {
      "code": "USD",
      "name": "US Dollar",
      "symbol": "$"
    }
  ]
}
```

### Notes

- Returns all rows from the `currencies` table, ordered by `code ASC`
- No pagination — this is a small, static list
- Response uses the standard `{ "data": [...] }` envelope
- Empty table returns `{ "data": [] }`
- OpenAPI spec available at `GET /api/docs`

## Implementation Details

### Files Created

```
src/features/currencies/
├── domain/
│   ├── entities/currency.ts
│   ├── repositories/currency-repository.ts
│   └── usecases/list-currencies.ts
├── data/
│   ├── models/currency-model.ts
│   ├── sources/currency-service.ts
│   └── repositories/currency-repository-impl.ts
└── presentation/
    ├── controllers/currency-controller.ts
    ├── mappers/currency-mapper.ts
    ├── routers/currency-router.ts
    ├── validations/currency-validation.ts
    └── openapi-spec.ts
```

### Files Modified

- `src/service-locator.ts` — DI registrations for the currencies feature
- `src/app.ts` — Route mount at `/api/currencies`
- `src/core/openapi/openapi-builder.ts` — OpenAPI spec paths
