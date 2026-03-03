# Backend API Change Request: `/api/portfolio/by-asset-type`

## Problem

The `/api/portfolio/by-asset-type` endpoint currently groups results only by `asset_type_id`. This means if a user holds "Saham" (Stocks) in both IDR and SGD accounts, they are merged into a single row. The frontend has no `currency` field to display the correct currency symbol, resulting in all values defaulting to USD (`$`).

Other portfolio endpoints (`/api/portfolio/summary`, `/api/portfolio/by-account`, `/api/portfolio/by-country`) already return a `currency` field.

## Requested Changes

1. **Group by `(asset_type_id, currency)`** instead of just `asset_type_id`
2. **Include `currency` field** in each response item

### Expected Response Shape

```json
[
  {
    "asset_type_id": "uuid-stocks",
    "asset_type_code": "STOCK",
    "asset_type_name": "Saham",
    "currency": "IDR",
    "total_cost": 150000000,
    "current_value": 165000000,
    "unrealized_gain": 15000000,
    "realized_gain": 0
  },
  {
    "asset_type_id": "uuid-stocks",
    "asset_type_code": "STOCK",
    "asset_type_name": "Saham",
    "currency": "SGD",
    "total_cost": 5000,
    "current_value": 5500,
    "unrealized_gain": 500,
    "realized_gain": 0
  }
]
```

### SQL Change

Add `currency` (sourced from positions or accounts table) to both `SELECT` and `GROUP BY` clauses:

```sql
SELECT
  at.id AS asset_type_id,
  at.code AS asset_type_code,
  at.name AS asset_type_name,
  a.currency,  -- NEW
  SUM(p.total_cost) AS total_cost,
  SUM(p.current_value) AS current_value,
  SUM(p.unrealized_gain) AS unrealized_gain,
  SUM(p.realized_gain) AS realized_gain
FROM positions p
JOIN assets ast ON p.asset_id = ast.id
JOIN asset_types at ON ast.asset_type_id = at.id
JOIN accounts a ON p.account_id = a.id
GROUP BY at.id, at.code, at.name, a.currency  -- CHANGED: added a.currency
ORDER BY at.name, a.currency;
```

## Frontend Status

The frontend has been updated to:
- Accept an optional `currency` field (falls back to `"USD"` if missing)
- Display rows like "Saham (IDR)" and "Saham (SGD)" separately
- Use the correct currency symbol for formatting

Once the backend deploys this change, the hardcoded demo data toggle in the frontend can be removed.

---

# Backend API Change Request: `/api/portfolio/summary/converted`

## Problem

The current `/api/portfolio/summary` endpoint returns separate summary objects per native currency (e.g., one for IDR holdings, one for SGD holdings). Users want to see their **total portfolio value consolidated into a single chosen currency**. This requires exchange rate conversion on the backend.

The frontend currently uses hardcoded exchange rates as a placeholder. Once this endpoint is available, the frontend will call it directly and remove the hardcoded rates.

## Requested Endpoint

`GET /api/portfolio/summary/converted?currency=USD`

Returns a single consolidated summary with all holdings converted to the requested target currency.

### Request

- **Method:** GET
- **Query params:**
  - `currency` (required) — target display currency code (e.g., `"USD"`, `"IDR"`, `"SGD"`)

### Expected Response Shape

```json
{
  "total_cost": 12345.67,
  "current_value": 13456.78,
  "unrealized_gain": 1111.11,
  "realized_gain": 222.22,
  "total_dividends": 100.00,
  "total_interest": 50.00,
  "total_fees": 25.00,
  "currency": "USD",
  "exchange_rates_used": {
    "IDR_USD": 0.0000625,
    "SGD_USD": 0.74
  }
}
```

### Conversion Logic

For each native-currency summary row:
1. Look up the exchange rate from the row's currency to the target currency
2. Multiply all monetary fields (`total_cost`, `current_value`, `unrealized_gain`, `realized_gain`, `total_dividends`, `total_interest`, `total_fees`) by the rate
3. Sum across all rows

If the source currency matches the target currency, the rate is `1.0` (no conversion needed).

### SQL Approach (Pseudocode)

```sql
-- Step 1: Get per-currency summaries (existing query)
-- Step 2: Join with exchange_rates table
-- Step 3: Multiply and sum

SELECT
  :target_currency AS currency,
  SUM(s.total_cost * er.rate) AS total_cost,
  SUM(s.current_value * er.rate) AS current_value,
  SUM(s.unrealized_gain * er.rate) AS unrealized_gain,
  SUM(s.realized_gain * er.rate) AS realized_gain,
  SUM(s.total_dividends * er.rate) AS total_dividends,
  SUM(s.total_interest * er.rate) AS total_interest,
  SUM(s.total_fees * er.rate) AS total_fees
FROM portfolio_summary s
JOIN exchange_rates er
  ON er.from_currency = s.currency
  AND er.to_currency = :target_currency;
```

### Error Cases

| Scenario | Response |
|----------|----------|
| Missing `currency` param | `400` — `{ "code": "INVALID_PARAMS", "message": "currency query param is required" }` |
| Unsupported currency | `400` — `{ "code": "UNSUPPORTED_CURRENCY", "message": "Exchange rate not available for XYZ" }` |
| No portfolio data | `200` — All fields `0`, currency set to target |

### Notes

- Exchange rates should be daily or near-real-time
- The `exchange_rates_used` field in the response is optional but helpful for transparency
- This endpoint requires the same auth headers as other portfolio endpoints (`Authorization`, `X-Account-Id`)

## Frontend Status

The frontend currently implements this feature with hardcoded exchange rates:
- `src/core/helpers/exchange-rates.ts` — hardcoded rate table (USD base)
- Client-side conversion and summation in `portfolio-summary-impl.tsx`
- A "Display in" dropdown lets users pick the target currency

Once this endpoint is deployed, the frontend will:
1. Call `GET /api/portfolio/summary/converted?currency=X` instead of doing client-side conversion
2. Remove the hardcoded exchange rates helper
