/**
 * Look up an exchange rate from a rates map. Returns `null` when the rate is unavailable,
 * so callers can decide how to handle missing conversions instead of silently using 1:1.
 */
export function getExchangeRate(from: string, to: string, rates: Record<string, number>): number | null {
  if (from === to) return 1;
  const key = `${from}_${to}`;
  if (key in rates) return rates[key];
  const reverseKey = `${to}_${from}`;
  if (reverseKey in rates && rates[reverseKey] !== 0) return 1 / rates[reverseKey];
  return null;
}
