"use client";

import { useGetPortfolioConvertedSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-converted-summary";
import { CurrencyTabs } from "@/core/presentations/components/currency-tabs";
import { SelectInput } from "@/core/presentations/components/select-input";
import { useCurrencySelector } from "@/core/presentations/hooks/use-currency-selector";
import { PortfolioSummaryImpl } from "@/app/(authenticated)/home/_components/portfolio-summary-impl";
import { PortfolioBreakdownImpl } from "@/app/(authenticated)/home/_components/portfolio-breakdown-impl";
import { PositionsTableImpl } from "@/app/(authenticated)/home/_components/positions-table-impl";
import { AddTransactionButton } from "@/app/(authenticated)/home/_components/add-transaction-button";

export function DashboardClient() {
  const {
    nativeCurrencies,
    displayCurrencyOptions,
    setSelectedCurrency,
    setDisplayCurrency,
    isAllMode,
    activeCurrency,
    activeDisplayCurrency,
    showDisplaySelector,
  } = useCurrencySelector();

  const { data: convertedSummary } = useGetPortfolioConvertedSummary(isAllMode ? (activeDisplayCurrency ?? null) : null);

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
      <PortfolioSummaryImpl
        selectedCurrency={isAllMode ? null : (activeCurrency ?? null)}
        displayCurrency={isAllMode ? (activeDisplayCurrency ?? null) : null}
      />
      <PortfolioBreakdownImpl
        selectedCurrency={isAllMode ? null : (activeCurrency ?? null)}
        combinedMode={isAllMode}
        displayCurrency={isAllMode ? (activeDisplayCurrency ?? null) : null}
        exchangeRates={isAllMode ? (convertedSummary?.exchangeRatesUsed ?? null) : null}
      />
      <PositionsTableImpl filterCurrency={isAllMode ? null : (activeCurrency ?? null)} />
    </div>
  );
}
