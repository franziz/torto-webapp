"use client";

import { useListPositions } from "@/features/position/presentation/hooks/use-list-positions";
import { SectionCard } from "@/core/presentations/components/section-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { Table } from "@/core/presentations/components/table/table";
import { Badge } from "@/core/presentations/components/badge";
import { formatCurrency } from "@/core/helpers/format-currency";

export function PositionsTableImpl() {
  const { positions, loading, error } = useListPositions({ page: 1, limit: 50 });

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

  if (positions.length === 0) {
    return (
      <SectionCard title="Holdings">
        <p className="py-8 text-center text-sm text-gray-500">No positions found.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Holdings" bodyClassName="">
      <Table.Container>
        <Table>
          <Table.Header
            items={[
              { node: "Asset", hideOnMobile: false },
              { node: "Ticker", hideOnMobile: true },
              { node: "Type", hideOnMobile: true },
              { node: "Account", hideOnMobile: true },
              { node: "Units", hideOnMobile: true },
              { node: "Avg Cost", hideOnMobile: true },
              { node: "Current Value", hideOnMobile: false },
              { node: "Gain", hideOnMobile: false },
              { node: "Currency", hideOnMobile: true },
            ]}
          />
          <Table.Body
            items={positions.map((pos) => ({
              row: [
                {
                  node: <span className="font-medium text-gray-900">{pos.assetName ?? "\u2014"}</span>,
                  hideOnMobile: false,
                },
                { node: pos.assetTicker ?? "\u2014", hideOnMobile: true },
                {
                  node: pos.assetTypeName ? <Badge>{pos.assetTypeName}</Badge> : "\u2014",
                  hideOnMobile: true,
                },
                { node: pos.accountName ?? "\u2014", hideOnMobile: true },
                { node: pos.totalUnits.toLocaleString(), hideOnMobile: true },
                { node: formatCurrency(pos.averageCostPerUnit, pos.currency), hideOnMobile: true },
                {
                  node: <span className="font-medium">{formatCurrency(pos.currentValue, pos.currency)}</span>,
                  hideOnMobile: false,
                },
                {
                  node: (
                    <span className={pos.unrealizedGain >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(pos.unrealizedGain, pos.currency)}
                    </span>
                  ),
                  hideOnMobile: false,
                },
                { node: pos.currency, hideOnMobile: true },
              ],
            }))}
          />
        </Table>
      </Table.Container>
    </SectionCard>
  );
}
