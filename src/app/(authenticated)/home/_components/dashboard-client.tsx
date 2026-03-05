"use client";

import { useState, useMemo } from "react";
import { useGetPortfolioSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-summary";
import { useGetPortfolioConvertedSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-converted-summary";
import { useListCurrencies } from "@/features/currency/presentation/hooks/use-list-currencies";
import { CurrencyTabs, ALL_TAB } from "@/core/presentations/components/currency-tabs";
import { SelectInput } from "@/core/presentations/components/select-input";
import { PortfolioSummaryImpl } from "@/app/(authenticated)/home/_components/portfolio-summary-impl";
import { PortfolioBreakdownImpl } from "@/app/(authenticated)/home/_components/portfolio-breakdown-impl";
import { AddTransactionButton } from "@/app/(authenticated)/home/_components/add-transaction-button";

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

  const isAllMode = selectedCurrency === ALL_TAB;

  const activeCurrency = isAllMode
    ? ALL_TAB
    : selectedCurrency && nativeCurrencies.includes(selectedCurrency)
      ? selectedCurrency
      : nativeCurrencies[0];

  const activeDisplayCurrency = displayCurrency && displayCurrencyOptions.includes(displayCurrency)
    ? displayCurrency
    : nativeCurrencies[0];

  // Fetch converted summary to get exchange rates for combined breakdown
  const { data: convertedSummary } = useGetPortfolioConvertedSummary(activeDisplayCurrency ?? null);

  const showDisplaySelector = isAllMode || displayCurrencyOptions.length > 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CurrencyTabs
          currencies={nativeCurrencies}
          selected={activeCurrency ?? ""}
          onChange={setSelectedCurrency}
          showAll={nativeCurrencies.length > 1}
        />
        <div className="flex items-center gap-3">
          <AddTransactionButton />
          {showDisplaySelector && displayCurrencyOptions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Display in</span>
              <SelectInput
                options={displayCurrencyOptions.map((c) => ({ label: c, value: c }))}
                value={activeDisplayCurrency ?? ""}
                onChange={(v) => setDisplayCurrency(v)}
                size="sm"
                className="w-24"
              />
            </div>
          )}
        </div>
      </div>
      <PortfolioSummaryImpl displayCurrency={activeDisplayCurrency ?? null} />
      <PortfolioBreakdownImpl
        selectedCurrency={isAllMode ? null : (activeCurrency ?? null)}
        combinedMode={isAllMode}
        displayCurrency={isAllMode ? (activeDisplayCurrency ?? null) : null}
        exchangeRates={isAllMode ? (convertedSummary?.exchangeRatesUsed ?? null) : null}
      />
    </div>
  );
}
