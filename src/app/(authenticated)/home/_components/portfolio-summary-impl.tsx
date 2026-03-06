"use client";

import { useGetPortfolioSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-summary";
import { useGetPortfolioConvertedSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-converted-summary";
import { SummaryCard } from "@/core/presentations/components/summary-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { formatCompactCurrency } from "@/core/helpers/format-currency";
import { ExchangeRatesDisplay } from "@/app/(authenticated)/home/_components/exchange-rates-display";

type PortfolioSummaryImplProps = {
  selectedCurrency: string | null;
  displayCurrency: string | null;
};

export function PortfolioSummaryImpl({ selectedCurrency, displayCurrency }: PortfolioSummaryImplProps) {
  const { data: summaryData, loading: summaryLoading, error: summaryError } = useGetPortfolioSummary();
  const { data: convertedData, loading: convertedLoading, error: convertedError } =
    useGetPortfolioConvertedSummary(displayCurrency);

  const isAllMode = !selectedCurrency && !!displayCurrency;
  const loading = isAllMode ? convertedLoading : summaryLoading;
  const error = isAllMode ? convertedError : summaryError;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay>{error.message}</ErrorDisplay>;
  }

  // All mode: use converted summary
  if (isAllMode && convertedData) {
    const { currency } = convertedData;
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Total Cost" value={formatCompactCurrency(convertedData.totalCost, currency)} />
          <SummaryCard
            title="Current Value"
            value={convertedData.currentValue != null ? formatCompactCurrency(convertedData.currentValue, currency) : "N/A"}
          />
          <SummaryCard
            title="Unrealized Gain"
            value={convertedData.unrealizedGain != null ? formatCompactCurrency(convertedData.unrealizedGain, currency) : "N/A"}
            trend={
              convertedData.unrealizedGain != null
                ? {
                    value: formatCompactCurrency(convertedData.unrealizedGain, currency),
                    positive: convertedData.unrealizedGain >= 0,
                  }
                : undefined
            }
          />
          <SummaryCard
            title="Realized Gain"
            value={formatCompactCurrency(convertedData.realizedGain, currency)}
            trend={{
              value: formatCompactCurrency(convertedData.realizedGain, currency),
              positive: convertedData.realizedGain >= 0,
            }}
          />
        </div>
        <ExchangeRatesDisplay rates={convertedData.exchangeRatesUsed} targetCurrency={currency} />
      </div>
    );
  }

  // Single currency mode: find the matching entry from native summary
  const entry = summaryData?.find((s) => s.currency === selectedCurrency);

  if (!entry) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Cost" value="-" />
        <SummaryCard title="Current Value" value="-" />
        <SummaryCard title="Unrealized Gain" value="-" />
        <SummaryCard title="Realized Gain" value="-" />
      </div>
    );
  }

  const { currency } = entry;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard title="Total Cost" value={formatCompactCurrency(entry.totalCost, currency)} />
      <SummaryCard
        title="Current Value"
        value={formatCompactCurrency(entry.currentValue, currency)}
      />
      <SummaryCard
        title="Unrealized Gain"
        value={formatCompactCurrency(entry.unrealizedGain, currency)}
        trend={{
          value: formatCompactCurrency(entry.unrealizedGain, currency),
          positive: entry.unrealizedGain >= 0,
        }}
      />
      <SummaryCard
        title="Realized Gain"
        value={formatCompactCurrency(entry.realizedGain, currency)}
        trend={{
          value: formatCompactCurrency(entry.realizedGain, currency),
          positive: entry.realizedGain >= 0,
        }}
      />
    </div>
  );
}
