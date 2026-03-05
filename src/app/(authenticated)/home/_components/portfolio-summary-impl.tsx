"use client";

import { useGetPortfolioConvertedSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-converted-summary";
import { SummaryCard } from "@/core/presentations/components/summary-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { formatCompactCurrency } from "@/core/helpers/format-currency";
import { ExchangeRatesDisplay } from "@/app/(authenticated)/home/_components/exchange-rates-display";

type PortfolioSummaryImplProps = {
  displayCurrency: string | null;
};

export function PortfolioSummaryImpl({ displayCurrency }: PortfolioSummaryImplProps) {
  const { data, loading, error } = useGetPortfolioConvertedSummary(displayCurrency);

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

  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Cost" value="-" />
        <SummaryCard title="Current Value" value="-" />
        <SummaryCard title="Unrealized Gain" value="-" />
        <SummaryCard title="Realized Gain" value="-" />
      </div>
    );
  }

  const { currency } = data;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Cost" value={formatCompactCurrency(data.totalCost, currency)} />
        <SummaryCard
          title="Current Value"
          value={data.currentValue != null ? formatCompactCurrency(data.currentValue, currency) : "N/A"}
        />
        <SummaryCard
          title="Unrealized Gain"
          value={data.unrealizedGain != null ? formatCompactCurrency(data.unrealizedGain, currency) : "N/A"}
          trend={
            data.unrealizedGain != null
              ? {
                  value: formatCompactCurrency(data.unrealizedGain, currency),
                  positive: data.unrealizedGain >= 0,
                }
              : undefined
          }
        />
        <SummaryCard
          title="Realized Gain"
          value={formatCompactCurrency(data.realizedGain, currency)}
          trend={{
            value: formatCompactCurrency(data.realizedGain, currency),
            positive: data.realizedGain >= 0,
          }}
        />
      </div>
      <ExchangeRatesDisplay rates={data.exchangeRatesUsed} targetCurrency={currency} />
    </div>
  );
}
