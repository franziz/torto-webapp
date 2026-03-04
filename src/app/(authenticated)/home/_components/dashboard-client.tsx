"use client";

import { useState, useMemo } from "react";
import { useGetPortfolioSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-summary";
import { useListCurrencies } from "@/features/currency/presentation/hooks/use-list-currencies";
import { CurrencyTabs } from "@/core/presentations/components/currency-tabs";
import { PortfolioSummaryImpl } from "@/app/(authenticated)/home/_components/portfolio-summary-impl";
import { PortfolioBreakdownImpl } from "@/app/(authenticated)/home/_components/portfolio-breakdown-impl";

export function DashboardClient() {
  const { data } = useGetPortfolioSummary();
  const { currencies } = useListCurrencies();

  const displayCurrencyOptions = useMemo(() => {
    if (!currencies) return [];
    return currencies.map((c) => c.code);
  }, [currencies]);

  const nativeCurrencies = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((s) => s.currency))];
  }, [data]);

  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<string | null>(null);

  const activeCurrency = selectedCurrency && nativeCurrencies.includes(selectedCurrency)
    ? selectedCurrency
    : nativeCurrencies[0];

  const activeDisplayCurrency = displayCurrency && displayCurrencyOptions.includes(displayCurrency)
    ? displayCurrency
    : nativeCurrencies[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <CurrencyTabs currencies={nativeCurrencies} selected={activeCurrency ?? ""} onChange={setSelectedCurrency} />
        {displayCurrencyOptions.length > 1 && (
          <div className="flex items-center gap-2">
            <label htmlFor="display-currency" className="text-xs font-medium text-gray-500 whitespace-nowrap">
              Display in
            </label>
            <select
              id="display-currency"
              value={activeDisplayCurrency ?? ""}
              onChange={(e) => setDisplayCurrency(e.target.value)}
              className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 outline-none focus:border-gray-400"
            >
              {displayCurrencyOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <PortfolioSummaryImpl displayCurrency={activeDisplayCurrency ?? null} />
      <PortfolioBreakdownImpl selectedCurrency={activeCurrency ?? null} />
    </div>
  );
}
