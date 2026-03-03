# Backend API Request: `GET /api/currencies`

## Problem

The frontend needs a list of available currencies for the "Display in" dropdown on the portfolio dashboard. Currently, the list is hardcoded in the frontend (`useListCurrencies` hook). This should be driven by the backend's `currencies` table, which already exists and is seeded with IDR, SGD, and USD.

## Requested Endpoint

`GET /api/currencies`

Returns all active currencies from the `currencies` table.

### Request

- **Method:** GET
- **Auth:** Same Bearer token as other endpoints
- **Query params:** None

### Expected Response Shape

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

### SQL

```sql
SELECT code, name, symbol
FROM currencies
ORDER BY code;
```

### Error Cases

| Scenario | HTTP | Response |
|----------|------|----------|
| No currencies in table | `200` | `{ "data": [] }` |

### Notes

- This endpoint is read-only; no CRUD needed for currencies at this stage
- The `currencies` table already exists (created for the exchange rates feature)
- Response should use the standard `{ "data": [...] }` envelope

## Frontend Status

The frontend has a temporary hardcoded fallback in:
- `src/features/currency/presentation/hooks/use-list-currencies.ts`

Once this endpoint is deployed, the frontend will:
1. Build the full clean architecture vertical slice (service, repository, use case)
2. Replace the hardcoded list with a real API call via SWR
3. Remove the `TODO` marker in the hook
