"use client";

import { useMemo } from "react";
import { useGetPortfolioSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-summary";
import { SummaryCard } from "@/core/presentations/components/summary-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { formatCompactCurrency } from "@/core/helpers/format-currency";
import { convertCurrency } from "@/core/helpers/exchange-rates";

type PortfolioSummaryImplProps = {
  displayCurrency: string | null;
};

export function PortfolioSummaryImpl({ displayCurrency }: PortfolioSummaryImplProps) {
  const { data, loading, error } = useGetPortfolioSummary();

  const convertedSummary = useMemo(() => {
    if (!data || !displayCurrency) return null;

    let totalCost = 0;
    let currentValue = 0;
    let unrealizedGain = 0;
    let realizedGain = 0;

    for (const s of data) {
      totalCost += convertCurrency(s.totalCost, s.currency, displayCurrency);
      currentValue += convertCurrency(s.currentValue, s.currency, displayCurrency);
      unrealizedGain += convertCurrency(s.unrealizedGain, s.currency, displayCurrency);
      realizedGain += convertCurrency(s.realizedGain, s.currency, displayCurrency);
    }

    return { totalCost, currentValue, unrealizedGain, realizedGain, currency: displayCurrency };
  }, [data, displayCurrency]);

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

  if (!convertedSummary) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Cost" value="-" />
        <SummaryCard title="Current Value" value="-" />
        <SummaryCard title="Unrealized Gain" value="-" />
        <SummaryCard title="Realized Gain" value="-" />
      </div>
    );
  }

  const { currency } = convertedSummary;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard title="Total Cost" value={formatCompactCurrency(convertedSummary.totalCost, currency)} />
      <SummaryCard title="Current Value" value={formatCompactCurrency(convertedSummary.currentValue, currency)} />
      <SummaryCard
        title="Unrealized Gain"
        value={formatCompactCurrency(convertedSummary.unrealizedGain, currency)}
        trend={{
          value: formatCompactCurrency(convertedSummary.unrealizedGain, currency),
          positive: convertedSummary.unrealizedGain >= 0,
        }}
      />
      <SummaryCard
        title="Realized Gain"
        value={formatCompactCurrency(convertedSummary.realizedGain, currency)}
        trend={{
          value: formatCompactCurrency(convertedSummary.realizedGain, currency),
          positive: convertedSummary.realizedGain >= 0,
        }}
      />
    </div>
  );
}
