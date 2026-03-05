"use client";

import { useState, useMemo } from "react";
import { useGetPortfolioSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-summary";
import { useGetPortfolioConvertedSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-converted-summary";
import { useListPositions } from "@/features/position/presentation/hooks/use-list-positions";
import { useGetPortfolioByAssetType } from "@/features/portfolio/presentation/hooks/use-get-portfolio-by-asset-type";
import { useListCurrencies } from "@/features/currency/presentation/hooks/use-list-currencies";
import { CurrencyTabs, ALL_TAB } from "@/core/presentations/components/currency-tabs";
import { SelectInput } from "@/core/presentations/components/select-input";
import { DataCard } from "@/core/presentations/components/data-card";
import { Badge } from "@/core/presentations/components/badge";
import { SectionCard } from "@/core/presentations/components/section-card";
import { DonutChart } from "@/core/presentations/components/donut-chart";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { formatCurrency, formatCompactCurrency } from "@/core/helpers/format-currency";

function getRate(from: string, to: string, rates: Record<string, number>): number {
  if (from === to) return 1;
  const key = `${from}_${to}`;
  if (rates[key]) return rates[key];
  const reverseKey = `${to}_${from}`;
  if (rates[reverseKey]) return 1 / rates[reverseKey];
  return 1;
}

export function MobileDashboard() {
  const { data: summaryData, loading: summaryLoading, error: summaryError } = useGetPortfolioSummary();
  const { currencies } = useListCurrencies();

  const displayCurrencyOptions = useMemo(() => {
    if (!currencies) return [];
    return currencies.map((c) => c.code);
  }, [currencies]);

  const nativeCurrencies = useMemo(() => {
    if (!summaryData) return [];
    return [...new Set(summaryData.map((s) => s.currency))];
  }, [summaryData]);

  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<string | null>(null);
  const [showAllHoldings, setShowAllHoldings] = useState(false);

  const isAllMode = selectedCurrency === ALL_TAB;

  const activeCurrency = isAllMode
    ? ALL_TAB
    : selectedCurrency && nativeCurrencies.includes(selectedCurrency)
      ? selectedCurrency
      : nativeCurrencies[0];

  const activeDisplayCurrency =
    displayCurrency && displayCurrencyOptions.includes(displayCurrency) ? displayCurrency : nativeCurrencies[0];

  const { data: convertedSummary } = useGetPortfolioConvertedSummary(activeDisplayCurrency ?? null);

  const { positions, loading: positionsLoading } = useListPositions({
    page: 1,
    limit: showAllHoldings ? 50 : 5,
  });

  const { data: byAssetType, loading: assetTypeLoading } = useGetPortfolioByAssetType();

  const showDisplaySelector = isAllMode || displayCurrencyOptions.length > 1;

  // Hero values
  const hero = useMemo(() => {
    if (isAllMode && convertedSummary) {
      const gainPct =
        convertedSummary.totalCost > 0 && convertedSummary.unrealizedGain !== null
          ? (convertedSummary.unrealizedGain / convertedSummary.totalCost) * 100
          : 0;
      return {
        currency: convertedSummary.currency,
        currentValue: convertedSummary.currentValue,
        unrealizedGain: convertedSummary.unrealizedGain,
        gainPct,
        positionCount: convertedSummary.positionCount,
      };
    }

    if (summaryData && activeCurrency && activeCurrency !== ALL_TAB) {
      const entry = summaryData.find((s) => s.currency === activeCurrency);
      if (entry) {
        const gainPct = entry.totalCost > 0 ? (entry.unrealizedGain / entry.totalCost) * 100 : 0;
        return {
          currency: entry.currency,
          currentValue: entry.currentValue,
          unrealizedGain: entry.unrealizedGain,
          gainPct,
          positionCount: null,
        };
      }
    }

    return null;
  }, [isAllMode, convertedSummary, summaryData, activeCurrency]);

  // Sort positions by currentValue desc
  const sortedPositions = useMemo(() => {
    if (!positions) return [];
    return [...positions].sort((a, b) => b.currentValue - a.currentValue);
  }, [positions]);

  // Donut chart items
  const assetTypeItems = useMemo(() => {
    if (!byAssetType) return [];

    if (isAllMode && activeDisplayCurrency && convertedSummary?.exchangeRatesUsed) {
      const items = byAssetType.map((item) => ({
        label: item.assetTypeName,
        currency: item.currency,
        currentValue: item.currentValue,
      }));
      const map = new Map<string, number>();
      for (const item of items) {
        const rate = getRate(item.currency, activeDisplayCurrency, convertedSummary.exchangeRatesUsed);
        const converted = item.currentValue * rate;
        map.set(item.label, (map.get(item.label) ?? 0) + converted);
      }
      return Array.from(map.entries()).map(([label, value]) => ({
        label,
        value,
        formattedValue: formatCompactCurrency(value, activeDisplayCurrency),
      }));
    }

    const currency = activeCurrency && activeCurrency !== ALL_TAB ? activeCurrency : nativeCurrencies[0];
    if (!currency) return [];
    const filtered = byAssetType.filter((item) => item.currency === currency);
    return filtered.map((item) => ({
      label: item.assetTypeName,
      value: item.currentValue,
      formattedValue: formatCompactCurrency(item.currentValue, item.currency),
    }));
  }, [byAssetType, isAllMode, activeDisplayCurrency, convertedSummary, activeCurrency, nativeCurrencies]);

  // Income
  const income = useMemo(() => {
    if (isAllMode && convertedSummary) {
      return {
        currency: convertedSummary.currency,
        dividends: convertedSummary.totalDividends,
        interest: convertedSummary.totalInterest,
      };
    }
    if (summaryData && activeCurrency && activeCurrency !== ALL_TAB) {
      const entry = summaryData.find((s) => s.currency === activeCurrency);
      if (entry) {
        return {
          currency: entry.currency,
          dividends: entry.totalDividends,
          interest: entry.totalInterest,
        };
      }
    }
    return null;
  }, [isAllMode, convertedSummary, summaryData, activeCurrency]);

  const hasIncome = income && (income.dividends > 0 || income.interest > 0);

  if (summaryLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (summaryError) return <ErrorDisplay>{summaryError.message}</ErrorDisplay>;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="px-1">
        {hero ? (
          <>
            <div className="text-3xl font-bold text-gray-900">
              {hero.currentValue !== null ? formatCurrency(hero.currentValue, hero.currency) : "—"}
            </div>
            <div
              className={`mt-0.5 text-sm font-medium ${
                hero.unrealizedGain !== null && hero.unrealizedGain >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {hero.unrealizedGain !== null ? (
                <>
                  {hero.unrealizedGain >= 0 ? "+" : ""}
                  {formatCurrency(hero.unrealizedGain, hero.currency)} ({hero.unrealizedGain >= 0 ? "+" : ""}
                  {hero.gainPct.toFixed(1)}%)
                </>
              ) : (
                "—"
              )}
            </div>
            {hero.positionCount !== null && (
              <div className="mt-0.5 text-xs text-gray-500">
                {hero.positionCount} holding{hero.positionCount !== 1 ? "s" : ""}
              </div>
            )}
          </>
        ) : (
          <div className="text-3xl font-bold text-gray-900">—</div>
        )}
      </div>

      {/* Currency selector */}
      <div className="flex items-center gap-3">
        <CurrencyTabs
          currencies={nativeCurrencies}
          selected={activeCurrency ?? ""}
          onChange={setSelectedCurrency}
          showAll={nativeCurrencies.length > 1}
        />
        {showDisplaySelector && displayCurrencyOptions.length > 0 && (
          <div className="flex items-center gap-2">
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

      {/* Top Holdings */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Top Holdings</h3>
        {positionsLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : sortedPositions.length === 0 ? (
          <p className="text-sm text-gray-500">No holdings yet.</p>
        ) : (
          <div className="space-y-2">
            {sortedPositions.map((p) => {
              const returnPct = p.totalCost > 0 ? (p.totalReturn / p.totalCost) * 100 : 0;
              const isPositive = p.totalReturn >= 0;
              return (
                <DataCard key={p.id}>
                  <div className="flex items-start justify-between">
                    <span className="font-medium text-gray-900">{p.assetName ?? p.assetTicker ?? p.assetId}</span>
                    <span className="font-medium text-gray-900">{formatCurrency(p.currentValue, p.currency)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <Badge>{p.assetTypeName ?? "Other"}</Badge>
                    <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPositive ? "+" : ""}
                      {formatCurrency(p.totalReturn, p.currency)} ({isPositive ? "+" : ""}
                      {returnPct.toFixed(1)}%)
                    </span>
                  </div>
                </DataCard>
              );
            })}
          </div>
        )}
        {positions && positions.length >= 5 && (
          <button
            className="mt-3 w-full text-center text-sm font-medium text-blue-600 active:text-blue-800"
            onClick={() => setShowAllHoldings((v) => !v)}
          >
            {showAllHoldings ? "Show less" : "See all holdings →"}
          </button>
        )}
      </div>

      {/* Portfolio Mix */}
      {assetTypeItems.length > 0 && (
        <SectionCard title="Portfolio Mix">
          <DonutChart items={assetTypeItems} />
        </SectionCard>
      )}

      {/* Income */}
      {hasIncome && (
        <SectionCard title="Income">
          <div className="space-y-3">
            {income.dividends > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dividends</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(income.dividends, income.currency)}
                </span>
              </div>
            )}
            {income.interest > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Interest</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(income.interest, income.currency)}
                </span>
              </div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
