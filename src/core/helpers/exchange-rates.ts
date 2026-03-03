/**
 * Hardcoded exchange rates (USD as base currency).
 * Each value represents how much 1 unit of that currency is worth in USD.
 *
 * TODO: Replace with real API call to GET /api/portfolio/summary/converted
 * once the backend endpoint is available.
 */
const RATES_TO_USD: Record<string, number> = {
  USD: 1,
  IDR: 0.0000625, // 1 IDR ≈ 0.0000625 USD (1 USD ≈ 16,000 IDR)
  SGD: 0.74, // 1 SGD ≈ 0.74 USD (1 USD ≈ 1.35 SGD)
};

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = RATES_TO_USD[fromCurrency];
  const toRate = RATES_TO_USD[toCurrency];

  if (fromRate == null || toRate == null) return amount;

  return (amount * fromRate) / toRate;
}

export function getDisplayCurrencyOptions(nativeCurrencies: string[]): string[] {
  const allCurrencies = new Set(nativeCurrencies);
  for (const code of Object.keys(RATES_TO_USD)) {
    allCurrencies.add(code);
  }
  return [...allCurrencies].sort();
}
