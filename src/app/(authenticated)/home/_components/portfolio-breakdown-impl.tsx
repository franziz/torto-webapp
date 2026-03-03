"use client";

import { useGetPortfolioByAssetType } from "@/features/portfolio/presentation/hooks/use-get-portfolio-by-asset-type";
import { useGetPortfolioByAccount } from "@/features/portfolio/presentation/hooks/use-get-portfolio-by-account";
import { SectionCard } from "@/core/presentations/components/section-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { DonutChart } from "@/core/presentations/components/donut-chart";
import { formatCompactCurrency } from "@/core/helpers/format-currency";

type PortfolioBreakdownImplProps = {
  selectedCurrency: string | null;
};

export function PortfolioBreakdownImpl({ selectedCurrency }: PortfolioBreakdownImplProps) {
  const { data: byAssetType, loading: loadingAssetType, error: errorAssetType } = useGetPortfolioByAssetType();
  const { data: byAccount, loading: loadingAccount, error: errorAccount } = useGetPortfolioByAccount();

  const isLoading = loadingAssetType || loadingAccount;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (errorAssetType) return <ErrorDisplay>{errorAssetType.message}</ErrorDisplay>;
  if (errorAccount) return <ErrorDisplay>{errorAccount.message}</ErrorDisplay>;

  const filteredAssetType = byAssetType?.filter((item) => item.currency === selectedCurrency) ?? [];
  const filteredAccount = byAccount?.filter((item) => item.currency === selectedCurrency) ?? [];

  const assetTypeItems = filteredAssetType.map((item) => ({
    label: item.assetTypeName,
    value: item.currentValue,
    formattedValue: formatCompactCurrency(item.currentValue, item.currency),
  }));

  const accountItems = filteredAccount.map((item) => ({
    label: item.accountName,
    value: item.currentValue,
    formattedValue: formatCompactCurrency(item.currentValue, item.currency),
  }));

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
