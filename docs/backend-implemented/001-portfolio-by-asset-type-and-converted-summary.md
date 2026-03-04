# Backend Implementation Status

Reference: [`BACKEND_REQUEST.md`](./BACKEND_REQUEST.md)

**Branch:** `dev`
**OpenAPI Spec:** `GET /api/docs/openapi.json` (auto-generated, always up to date with the running server)

---

## 1. `/api/portfolio/by-asset-type` — Currency Grouping

**Status: Implemented**

The endpoint now groups by `(asset_type_id, currency)` and includes a `currency` field in each item.

### Response Shape

```json
{
  "data": [
    {
      "asset_type_id": "uuid-stocks",
      "asset_type_code": "STOCK",
      "asset_type_name": "Saham",
      "currency": "IDR",
      "total_cost": 150000000,
      "current_value": 165000000,
      "unrealized_gain": 15000000,
      "realized_gain": 0,
      "position_count": 3
    },
    {
      "asset_type_id": "uuid-stocks",
      "asset_type_code": "STOCK",
      "asset_type_name": "Saham",
      "currency": "SGD",
      "total_cost": 5000,
      "current_value": 5500,
      "unrealized_gain": 500,
      "realized_gain": 0,
      "position_count": 1
    }
  ]
}
```

### Differences from Request

| Requested | Implemented | Notes |
|-----------|-------------|-------|
| `currency` from `accounts.currency` (via JOIN) | `currency` from `positions.currency` | No extra JOIN needed; `positions.currency` is a denormalized copy of the account's currency, consistent with how `/api/portfolio/summary` sources currency |
| `position_count` not mentioned | `position_count` included | Already present in the existing response, kept for consistency with other portfolio endpoints |
| Response wrapped in `{ "data": [...] }` | Same | Matches existing envelope pattern |

### Frontend Action

The `currency` field is now always present (not optional). The frontend can remove the `"USD"` fallback and the hardcoded demo data toggle.

---

## 2. `/api/portfolio/summary/converted` — Converted Summary

**Status: Implemented**

### Request

```
GET /api/portfolio/summary/converted?currency=SGD
```

- **Auth:** Same as other portfolio endpoints (Bearer token)
- **Query param:** `currency` (required, 3-letter uppercase code, e.g. `SGD`, `IDR`, `USD`)
- **Validation:** The `currency` param is validated via Joi — missing or invalid values return `400`

### Response Shape

```json
{
  "data": {
    "currency": "SGD",
    "total_cost": 1234.56,
    "current_value": 1345.67,
    "unrealized_gain": 111.11,
    "realized_gain": 22.22,
    "total_dividends": 10.0,
    "total_interest": 5.0,
    "total_fees": 2.5,
    "position_count": 5,
    "exchange_rates_used": {
      "IDR_SGD": 0.0000845
    }
  }
}
```

### Differences from Request

| Requested | Implemented | Notes |
|-----------|-------------|-------|
| `current_value` always a number | `current_value` can be `null` | Returns `null` when no positions have a manual price set (consistent with all other portfolio endpoints) |
| `unrealized_gain` always a number | `unrealized_gain` can be `null` | `null` when `current_value` is `null` |
| `position_count` not in request | `position_count` included | Added for consistency with other portfolio endpoints |
| Response at top level `{ "total_cost": ... }` | Wrapped in `{ "data": { ... } }` | Matches the standard API envelope pattern used by all endpoints |
| Error code `INVALID_PARAMS` | Error code `VALIDATION_FAILED` | Uses the existing error code convention; Joi validation returns `400` with `VALIDATION_FAILED` |
| Error code `UNSUPPORTED_CURRENCY` | Error code `EXCHANGE_RATE_NOT_FOUND` | More accurate — the currency may be valid but simply have no exchange rate configured yet |

### Error Cases

| Scenario | HTTP | Response |
|----------|------|----------|
| Missing `currency` param | `400` | `{ "code": "VALIDATION_FAILED", "message": "Validation failed" }` |
| No exchange rate for a currency pair | `400` | `{ "code": "EXCHANGE_RATE_NOT_FOUND", "message": "Exchange rate not available for IDR to USD" }` |
| No portfolio data | `200` | All monetary fields `0`, `current_value: null`, `exchange_rates_used: {}` |

### Frontend Action

1. Call `GET /api/portfolio/summary/converted?currency=X` instead of client-side conversion
2. Remove `src/core/helpers/exchange-rates.ts` (hardcoded rate table)
3. Handle `current_value: null` and `unrealized_gain: null` (display as "N/A" or similar)
4. Exchange rates must be seeded via the new Exchange Rates API before this endpoint returns useful data

---

## 3. Exchange Rates CRUD API (Additional)

**Status: Implemented (new feature, not in original request)**

The converted summary endpoint requires exchange rates to exist in the database. A full CRUD API was built to manage them.

### Base URL

```
/api/exchange-rates
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/exchange-rates` | Create an exchange rate |
| `GET` | `/api/exchange-rates` | List exchange rates (paginated) |
| `GET` | `/api/exchange-rates/:id` | Get exchange rate by ID |
| `PUT` | `/api/exchange-rates/:id` | Update an exchange rate |
| `DELETE` | `/api/exchange-rates/:id` | Delete an exchange rate (soft delete) |

### Create / Update Body

```json
// POST /api/exchange-rates
{
  "from_currency": "IDR",
  "to_currency": "SGD",
  "rate": 0.0000845
}

// PUT /api/exchange-rates/:id
{
  "rate": 0.0000850
}
```

### List Query Params

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `from_currency` | string | Filter by source currency (optional) |
| `to_currency` | string | Filter by target currency (optional) |

### Response Shape

```json
{
  "data": {
    "id": "uuid",
    "from_currency": "IDR",
    "to_currency": "SGD",
    "rate": 0.0000845,
    "created_at": "2026-03-03T12:00:00.000+00:00",
    "updated_at": "2026-03-03T12:00:00.000+00:00"
  }
}
```

### Important Notes

- Exchange rates are **global** (not user-scoped) — all authenticated users share the same rates
- Each `(from_currency, to_currency)` pair must be unique
- Rates are stored as explicit directional pairs: `IDR -> SGD` is a separate record from `SGD -> IDR`
- The frontend must seed the required exchange rates before the converted summary endpoint will work
- Auth required (same Bearer token as all other endpoints)

---

## 4. Currencies Table (Additional)

**Status: Implemented (new feature, not in original request)**

A `currencies` reference table was created to support the exchange rates feature. It is seeded with:

| Code | Name | Symbol |
|------|------|--------|
| `IDR` | Indonesian Rupiah | `Rp` |
| `SGD` | Singapore Dollar | `S$` |
| `USD` | US Dollar | `$` |

No API endpoints exist for currencies — it is seed-only for now. The `exchange_rates` table references this table via foreign keys on `from_currency` and `to_currency`.

---

## Setup Checklist

Before the frontend can use the converted summary endpoint:

1. Run database migrations (`yarn migrate`) — creates `currencies` and `exchange_rates` tables
2. Seed exchange rates via the CRUD API, e.g.:
   - `POST /api/exchange-rates` with `{ "from_currency": "IDR", "to_currency": "SGD", "rate": 0.0000845 }`
   - `POST /api/exchange-rates` with `{ "from_currency": "SGD", "to_currency": "IDR", "rate": 11834.32 }`
   - Add more pairs as needed for the target currencies the "Display in" dropdown supports
3. The `/api/portfolio/by-asset-type` change is immediately available — no setup needed
