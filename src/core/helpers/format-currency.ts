export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompactCurrency(amount: number, currency: string = "USD"): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  if (currency === "IDR") {
    const symbol = "Rp";
    let formatted: string;

    if (abs >= 1_000_000_000) {
      formatted = `${symbol} ${(abs / 1_000_000_000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`;
    } else if (abs >= 1_000_000) {
      formatted = `${symbol} ${(abs / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Jt`;
    } else {
      return formatCurrency(amount, currency);
    }

    return isNegative ? `-${formatted}` : formatted;
  }

  const symbolMap: Record<string, string> = { USD: "$", SGD: "S$" };
  const sym = symbolMap[currency] ?? formatCurrency(0, currency).replace(/[\d.,\s]/g, "");

  let formatted: string;

  if (abs >= 1_000_000_000) {
    formatted = `${sym}${(abs / 1_000_000_000).toFixed(1)}B`;
  } else if (abs >= 1_000_000) {
    formatted = `${sym}${(abs / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 1_000) {
    formatted = `${sym}${(abs / 1_000).toFixed(1)}K`;
  } else {
    return formatCurrency(amount, currency);
  }

  return isNegative ? `-${formatted}` : formatted;
}
