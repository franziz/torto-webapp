import { CurrencyEntity } from "@/features/currency/domain/entities/currency";

// TODO: Replace with real API call to GET /api/currencies once backend deploys the endpoint
const HARDCODED_CURRENCIES: CurrencyEntity[] = [
  new CurrencyEntity({ code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" }),
  new CurrencyEntity({ code: "SGD", name: "Singapore Dollar", symbol: "S$" }),
  new CurrencyEntity({ code: "USD", name: "US Dollar", symbol: "$" }),
];

export function useListCurrencies(): string[] {
  return HARDCODED_CURRENCIES.map((c) => c.code);
}
