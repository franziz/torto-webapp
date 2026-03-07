"use client";

import { useState, useMemo } from "react";
import { useListPositions } from "@/features/position/presentation/hooks/use-list-positions";
import { useUpdateCurrentPrice } from "@/features/position/presentation/hooks/use-update-current-price";
import { SectionCard } from "@/core/presentations/components/section-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { Table } from "@/core/presentations/components/table/table";
import { Badge } from "@/core/presentations/components/badge";
import { SelectInput } from "@/core/presentations/components/select-input";
import { DataCard, DataCardRow } from "@/core/presentations/components/data-card";
import { Modal } from "@/core/presentations/components/modal";
import { formatCurrency } from "@/core/helpers/format-currency";
import { InlinePriceCell } from "@/app/(authenticated)/home/_components/inline-price-cell";
import { UpdateCurrentPriceUseCaseParams } from "@/features/position/domain/usecases/update-current-price.usecases";
import { useIsMobile } from "@/core/presentations/hooks/use-is-mobile";
import { PositionEntity } from "@/features/position/domain/entities/position";

type PositionsTableImplProps = {
  filterCurrency?: string | null;
};

export function PositionsTableImpl({ filterCurrency }: PositionsTableImplProps) {
  const isMobile = useIsMobile();
  const { positions, loading, error } = useListPositions({ page: 1, limit: 50, currency: filterCurrency ?? undefined });
  const { trigger } = useUpdateCurrentPrice();
  const [selectedPosition, setSelectedPosition] = useState<PositionEntity | null>(null);
  const [assetTypeFilter, setAssetTypeFilter] = useState("");

  const handleSavePrice = async (assetId: string, price: number) => {
    await trigger(new UpdateCurrentPriceUseCaseParams({ assetId, price }));
  };

  const assetTypeOptions = useMemo(() => {
    if (!positions) return [];
    const seen = new Map<string, string>();
    for (const pos of positions) {
      if (pos.assetTypeCode && pos.assetTypeName && !seen.has(pos.assetTypeCode)) {
        seen.set(pos.assetTypeCode, pos.assetTypeName);
      }
    }
    return Array.from(seen.entries()).map(([code, name]) => ({ value: code, label: name }));
  }, [positions]);

  const filteredPositions = useMemo(() => {
    if (!positions) return [];
    if (!assetTypeFilter) return positions;
    return positions.filter((pos) => pos.assetTypeCode === assetTypeFilter);
  }, [positions, assetTypeFilter]);

  const totals = useMemo(() => {
    const byCurrency = new Map<string, { totalCost: number; currentValue: number; totalReturn: number }>();
    for (const pos of filteredPositions) {
      const entry = byCurrency.get(pos.currency) ?? { totalCost: 0, currentValue: 0, totalReturn: 0 };
      entry.totalCost += pos.totalCost;
      entry.currentValue += pos.currentValue;
      entry.totalReturn += pos.totalReturn;
      byCurrency.set(pos.currency, entry);
    }
    return Array.from(byCurrency.entries()).map(([currency, vals]) => ({ currency, ...vals }));
  }, [filteredPositions]);

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

  const filterDropdown = assetTypeOptions.length > 1 && (
    <SelectInput
      label=""
      options={[{ label: "All Types", value: "" }, ...assetTypeOptions]}
      value={assetTypeFilter}
      onChange={setAssetTypeFilter}
      className="w-32"
    />
  );

  if (isMobile) {
    return (
      <>
        <SectionCard title="Holdings">
          <div className="space-y-3">
            {filterDropdown}
            {filteredPositions.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">No holdings match this filter.</p>
            ) : (
              <>
                {filteredPositions.map((pos) => (
                  <DataCard key={pos.id} onClick={() => setSelectedPosition(pos)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{pos.assetName ?? "\u2014"}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                          {pos.assetTicker && <span>{pos.assetTicker}</span>}
                          {pos.assetTypeName && <Badge>{pos.assetTypeName}</Badge>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(pos.currentValue, pos.currency)}</div>
                        <div className={`text-xs ${pos.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(pos.totalReturn, pos.currency).replace("-", "\u2011")}
                        </div>
                      </div>
                    </div>
                  </DataCard>
                ))}
                {totals.length > 0 && (
                  <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase">Total</div>
                    {totals.map((t) => (
                      <div key={t.currency} className="mt-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Cost</span>
                          <span className="text-sm text-gray-700">{formatCurrency(t.totalCost, t.currency)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Value</span>
                          <span className="text-sm font-semibold text-gray-900">{formatCurrency(t.currentValue, t.currency)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Return</span>
                          <span className={`text-xs font-medium ${t.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {t.totalReturn >= 0 ? "+" : ""}{formatCurrency(t.totalReturn, t.currency).replace("-", "\u2011")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </SectionCard>

        {selectedPosition && (
          <Modal open={!!selectedPosition} onClose={() => setSelectedPosition(null)} title={selectedPosition.assetName ?? "Position Details"}>
            <div className="space-y-3">
              <DataCardRow label="Account" value={selectedPosition.accountName ?? "\u2014"} />
              <DataCardRow label="Units" value={selectedPosition.totalUnits.toLocaleString()} />
              <DataCardRow label="Avg Cost" value={formatCurrency(selectedPosition.averageCostPerUnit, selectedPosition.currency, 4)} />
              <DataCardRow label="Market Price" value={
                <InlinePriceCell
                  positionAssetId={selectedPosition.assetId}
                  currentPrice={selectedPosition.effectivePrice ?? selectedPosition.manualCurrentPrice}
                  currency={selectedPosition.currency}
                  isMarketPriced={selectedPosition.isMarketPriced === true}
                  onSave={handleSavePrice}
                />
              } />
              <DataCardRow label="Total Cost" value={formatCurrency(selectedPosition.totalCost, selectedPosition.currency)} />
              <DataCardRow label="Current Value" value={formatCurrency(selectedPosition.currentValue, selectedPosition.currency)} />
              <DataCardRow label="Total Return" value={
                <span className={selectedPosition.totalReturn >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(selectedPosition.totalReturn, selectedPosition.currency).replace("-", "\u2011")}
                </span>
              } />
              <DataCardRow label="Dividends" value={formatCurrency(selectedPosition.totalDividends, selectedPosition.currency)} />
              <DataCardRow label="Interest" value={formatCurrency(selectedPosition.totalInterest, selectedPosition.currency)} />
            </div>
          </Modal>
        )}
      </>
    );
  }

  return (
    <SectionCard title="Holdings" headerAction={filterDropdown} bodyClassName="">
      {filteredPositions.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No holdings match this filter.</p>
      ) : (
        <Table.Container>
          <Table>
            <Table.Header
              items={[
                { node: "Asset", hideOnMobile: false },
                { node: "Account", hideOnMobile: true },
                { node: "Units", hideOnMobile: true, className: "text-right" },
                { node: "Avg Cost / Mkt Price", hideOnMobile: true, className: "text-right" },
                { node: "Total Cost", hideOnMobile: true, className: "text-right" },
                { node: "Current Value", hideOnMobile: false, className: "text-right" },
                { node: "Total Return", hideOnMobile: false, className: "text-right" },
              ]}
            />
            <Table.Body
              items={filteredPositions.map((pos) => ({
                row: [
                  {
                    node: (
                      <div>
                        <div className="font-medium text-gray-900">{pos.assetName ?? "\u2014"}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                          {pos.assetTicker && <span>{pos.assetTicker}</span>}
                          {pos.assetTypeName && <Badge>{pos.assetTypeName}</Badge>}
                        </div>
                      </div>
                    ),
                    hideOnMobile: false,
                  },
                  { node: pos.accountName ?? "\u2014", hideOnMobile: true },
                  { node: <span className="whitespace-nowrap">{pos.totalUnits.toLocaleString()}</span>, hideOnMobile: true, className: "text-right" },
                  {
                    node: (
                      <div>
                        <div className="whitespace-nowrap">{formatCurrency(pos.averageCostPerUnit, pos.currency, 4)}</div>
                        <div className="mt-0.5">
                          <InlinePriceCell
                            positionAssetId={pos.assetId}
                            currentPrice={pos.effectivePrice ?? pos.manualCurrentPrice}
                            currency={pos.currency}
                            isMarketPriced={pos.isMarketPriced === true}
                            onSave={handleSavePrice}
                          />
                        </div>
                      </div>
                    ),
                    hideOnMobile: true,
                    className: "text-right",
                  },
                  {
                    node: <span className="whitespace-nowrap">{formatCurrency(pos.totalCost, pos.currency)}</span>,
                    hideOnMobile: true,
                    className: "text-right",
                  },
                  {
                    node: <span className="whitespace-nowrap font-medium">{formatCurrency(pos.currentValue, pos.currency)}</span>,
                    hideOnMobile: false,
                    className: "text-right",
                  },
                  {
                    node: (
                      <span className={`whitespace-nowrap ${pos.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(pos.totalReturn, pos.currency).replace("-", "\u2011")}
                      </span>
                    ),
                    hideOnMobile: false,
                    className: "text-right",
                  },
                ],
              }))}
            />
            {totals.length > 0 && (
              <Table.Footer
                cells={[
                  { node: "Total", hideOnMobile: false, colSpan: 4, className: "text-left" },
                  {
                    node: (
                      <div className="space-y-0.5">
                        {totals.map((t) => (
                          <div key={t.currency} className="whitespace-nowrap">{formatCurrency(t.totalCost, t.currency)}</div>
                        ))}
                      </div>
                    ),
                    hideOnMobile: true,
                    className: "text-right",
                  },
                  {
                    node: (
                      <div className="space-y-0.5">
                        {totals.map((t) => (
                          <div key={t.currency} className="whitespace-nowrap">{formatCurrency(t.currentValue, t.currency)}</div>
                        ))}
                      </div>
                    ),
                    hideOnMobile: false,
                    className: "text-right",
                  },
                  {
                    node: (
                      <div className="space-y-0.5">
                        {totals.map((t) => (
                          <div key={t.currency} className={`whitespace-nowrap ${t.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {t.totalReturn >= 0 ? "+" : ""}{formatCurrency(t.totalReturn, t.currency).replace("-", "\u2011")}
                          </div>
                        ))}
                      </div>
                    ),
                    hideOnMobile: false,
                    className: "text-right",
                  },
                ]}
              />
            )}
          </Table>
        </Table.Container>
      )}
    </SectionCard>
  );
}
