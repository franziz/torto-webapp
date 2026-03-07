"use client";

import { useMemo } from "react";
import { useGetPortfolioByAssetType } from "@/features/portfolio/presentation/hooks/use-get-portfolio-by-asset-type";
import { useGetPortfolioByAccount } from "@/features/portfolio/presentation/hooks/use-get-portfolio-by-account";
import { SectionCard } from "@/core/presentations/components/section-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { DonutChart } from "@/core/presentations/components/donut-chart";
import { formatCompactCurrency } from "@/core/helpers/format-currency";
import { getExchangeRate } from "@/core/helpers/get-exchange-rate";

type PortfolioBreakdownImplProps = {
  selectedCurrency: string | null;
  combinedMode?: boolean;
  displayCurrency?: string | null;
  exchangeRates?: Record<string, number> | null;
};

function aggregateByLabel(
  items: { label: string; currency: string; currentValue: number }[],
  targetCurrency: string,
  rates: Record<string, number>,
): { label: string; value: number; formattedValue: string }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const rate = getExchangeRate(item.currency, targetCurrency, rates);
    if (rate === null) continue;
    const converted = item.currentValue * rate;
    map.set(item.label, (map.get(item.label) ?? 0) + converted);
  }
  return Array.from(map.entries()).map(([label, value]) => ({
    label,
    value,
    formattedValue: formatCompactCurrency(value, targetCurrency),
  }));
}

export function PortfolioBreakdownImpl({ selectedCurrency, combinedMode, displayCurrency, exchangeRates }: PortfolioBreakdownImplProps) {
  const { data: byAssetType, loading: loadingAssetType, error: errorAssetType } = useGetPortfolioByAssetType();
  const { data: byAccount, loading: loadingAccount, error: errorAccount } = useGetPortfolioByAccount();

  const isLoading = loadingAssetType || loadingAccount;

  const assetTypeItems = useMemo(() => {
    if (!byAssetType) return [];

    if (combinedMode && displayCurrency && exchangeRates) {
      const items = byAssetType.map((item) => ({
        label: item.assetTypeName,
        currency: item.currency,
        currentValue: item.currentValue,
      }));
      return aggregateByLabel(items, displayCurrency, exchangeRates);
    }

    const filtered = byAssetType.filter((item) => item.currency === selectedCurrency);
    return filtered.map((item) => ({
      label: item.assetTypeName,
      value: item.currentValue,
      formattedValue: formatCompactCurrency(item.currentValue, item.currency),
    }));
  }, [byAssetType, combinedMode, displayCurrency, exchangeRates, selectedCurrency]);

  const accountItems = useMemo(() => {
    if (!byAccount) return [];

    if (combinedMode && displayCurrency && exchangeRates) {
      const items = byAccount.map((item) => ({
        label: item.accountName,
        currency: item.currency,
        currentValue: item.currentValue,
      }));
      return aggregateByLabel(items, displayCurrency, exchangeRates);
    }

    const filtered = byAccount.filter((item) => item.currency === selectedCurrency);
    return filtered.map((item) => ({
      label: item.accountName,
      value: item.currentValue,
      formattedValue: formatCompactCurrency(item.currentValue, item.currency),
    }));
  }, [byAccount, combinedMode, displayCurrency, exchangeRates, selectedCurrency]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (errorAssetType) return <ErrorDisplay>{errorAssetType.message}</ErrorDisplay>;
  if (errorAccount) return <ErrorDisplay>{errorAccount.message}</ErrorDisplay>;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <SectionCard title="By Asset Type">
        <DonutChart items={assetTypeItems} />
      </SectionCard>

      <SectionCard title="By Account">
        <DonutChart items={accountItems} />
      </SectionCard>
    </div>
  );
}
