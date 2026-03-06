"use client";

import { useState, useMemo } from "react";
import { useGetHoldings } from "@/features/portfolio/presentation/hooks/use-get-holdings";
import { useGetPortfolioSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-summary";
import { useGetPortfolioConvertedSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-converted-summary";
import { useListCurrencies } from "@/features/currency/presentation/hooks/use-list-currencies";
import { CurrencyTabs, ALL_TAB } from "@/core/presentations/components/currency-tabs";
import { SelectInput } from "@/core/presentations/components/select-input";
import { SectionCard } from "@/core/presentations/components/section-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { Table } from "@/core/presentations/components/table/table";
import { Badge } from "@/core/presentations/components/badge";
import { TextInput } from "@/core/presentations/components/text-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { DataCard, DataCardRow } from "@/core/presentations/components/data-card";
import { Modal } from "@/core/presentations/components/modal";
import { Pagination } from "@/core/presentations/components/pagination";
import { AddFlow } from "@/core/presentations/components/add-flow/add-flow";
import { formatCurrency } from "@/core/helpers/format-currency";
import { useIsMobile } from "@/core/presentations/hooks/use-is-mobile";
import { HoldingEntity } from "@/features/portfolio/domain/entities/holding";

const PAGE_LIMIT = 20;

export function InvestmentsListImpl() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<HoldingEntity | null>(null);

  // Currency state
  const { data: summaryData, loading: summaryLoading } = useGetPortfolioSummary();
  const { currencies } = useListCurrencies();
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<string | null>(null);

  const nativeCurrencies = useMemo(() => {
    if (!summaryData) return [];
    return [...new Set(summaryData.map((s) => s.currency))];
  }, [summaryData]);

  const displayCurrencyOptions = useMemo(() => {
    if (!currencies) return [];
    return currencies.map((c) => c.code);
  }, [currencies]);

  const isAllMode = selectedCurrency === ALL_TAB;
  const activeCurrency = isAllMode
    ? ALL_TAB
    : selectedCurrency && nativeCurrencies.includes(selectedCurrency)
      ? selectedCurrency
      : nativeCurrencies[0];

  const activeDisplayCurrency =
    displayCurrency && displayCurrencyOptions.includes(displayCurrency) ? displayCurrency : nativeCurrencies[0];

  const showDisplaySelector = isAllMode;

  // Fetch holdings from backend (paginated, sorted, filtered)
  const holdingsParams = useMemo(() => {
    const params: Record<string, any> = { page, limit: PAGE_LIMIT };
    if (search.trim()) params.search = search.trim();
    if (activeCurrency && activeCurrency !== ALL_TAB) {
      params.currency = activeCurrency;
    }
    if (isAllMode && activeDisplayCurrency) {
      params.displayCurrency = activeDisplayCurrency;
      params.sortBy = "converted_value";
    }
    return params;
  }, [page, search, activeCurrency, isAllMode, activeDisplayCurrency]);

  const { holdings, meta, loading, error } = useGetHoldings(holdingsParams);

  // Totals from summary endpoints (server-computed across ALL holdings)
  const nativeTotals = useMemo(() => {
    if (!summaryData) return [];
    if (activeCurrency && activeCurrency !== ALL_TAB) {
      return summaryData.filter((s) => s.currency === activeCurrency);
    }
    return summaryData;
  }, [summaryData, activeCurrency]);

  const { data: convertedSummary } = useGetPortfolioConvertedSummary(
    showDisplaySelector && activeDisplayCurrency ? activeDisplayCurrency : null,
  );

  // Reset page when filters change
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const handleCurrencyChange = (c: string) => {
    setSelectedCurrency(c);
    setPage(1);
  };

  if (summaryLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* Portfolio totals hero */}
      <PortfolioHero
        nativeTotals={nativeTotals}
        convertedSummary={convertedSummary}
        showConverted={showDisplaySelector && !!convertedSummary}
      />

      {/* Currency tabs + display currency selector */}
      <div className="flex flex-wrap items-center gap-3">
        <CurrencyTabs
          currencies={nativeCurrencies}
          selected={activeCurrency ?? ""}
          onChange={handleCurrencyChange}
          showAll={nativeCurrencies.length > 1}
        />
        {showDisplaySelector && displayCurrencyOptions.length > 0 && (
          <SelectInput
            options={displayCurrencyOptions.map((c) => ({ label: c, value: c }))}
            value={activeDisplayCurrency ?? ""}
            onChange={(v) => {
              setDisplayCurrency(v);
              setPage(1);
            }}
            size="sm"
            className="w-24"
          />
        )}
      </div>

      <SectionCard
        title="Holdings"
        headerAction={
          <FilledButton type="button" onClick={() => setAddOpen(true)} className="w-auto">
            Record Activity
          </FilledButton>
        }
        bodyClassName=""
      >
        <div className="px-4 pb-3 pt-1 sm:px-6">
          <TextInput
            label=""
            placeholder="Search by name or ticker..."
            value={search}
            onChange={handleSearchChange}
            className="w-full sm:w-64"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <ErrorDisplay>{error.message}</ErrorDisplay>
        ) : !holdings || holdings.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            {search.trim() ? "No holdings match your search." : "No holdings yet."}
          </p>
        ) : isMobile ? (
          <MobileHoldingsList
            holdings={holdings}
            isAllMode={isAllMode}
            displayCurrency={activeDisplayCurrency}
            onSelect={setSelectedHolding}
          />
        ) : (
          <DesktopHoldingsTable
            holdings={holdings}
            isAllMode={isAllMode}
            displayCurrency={activeDisplayCurrency}
          />
        )}

        {/* Pagination */}
        {meta && <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />}
      </SectionCard>

      {selectedHolding && (
        <Modal
          open={!!selectedHolding}
          onClose={() => setSelectedHolding(null)}
          title={selectedHolding.assetName ?? "Holding Details"}
        >
          <div className="space-y-3">
            <DataCardRow label="Account" value={selectedHolding.accountName ?? "\u2014"} />
            <DataCardRow label="Type" value={selectedHolding.assetTypeName ?? "\u2014"} />
            <DataCardRow label="Units" value={selectedHolding.totalUnits.toLocaleString()} />
            <DataCardRow
              label="Avg Cost"
              value={formatCurrency(selectedHolding.averageCostPerUnit, selectedHolding.currency, 4)}
            />
            <DataCardRow
              label="Current Value"
              value={formatCurrency(selectedHolding.currentValue, selectedHolding.currency)}
            />
            <DataCardRow
              label="Total Return"
              value={
                selectedHolding.totalReturn != null ? (
                  <span className={selectedHolding.totalReturn >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(selectedHolding.totalReturn, selectedHolding.currency).replace("-", "\u2011")}
                  </span>
                ) : (
                  "\u2014"
                )
              }
            />
            <DataCardRow
              label="Dividends"
              value={formatCurrency(selectedHolding.totalDividends, selectedHolding.currency)}
            />
            <DataCardRow
              label="Interest"
              value={formatCurrency(selectedHolding.totalInterest, selectedHolding.currency)}
            />
            {selectedHolding.convertedValue != null && (
              <DataCardRow
                label="Converted Value"
                value={formatCurrency(selectedHolding.convertedValue, selectedHolding.currency)}
              />
            )}
          </div>
        </Modal>
      )}

      <AddFlow open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}

function MobileHoldingsList({
  holdings,
  isAllMode,
  displayCurrency,
  onSelect,
}: {
  holdings: HoldingEntity[];
  isAllMode: boolean;
  displayCurrency?: string | null;
  onSelect: (h: HoldingEntity) => void;
}) {
  return (
    <div className="space-y-3 p-4">
      {holdings.map((h) => {
        const showConverted = isAllMode && h.convertedValue != null && displayCurrency;
        const displayValue = showConverted ? h.convertedValue! : h.currentValue;
        const displayCcy = showConverted ? displayCurrency : h.currency;
        const returnPct = h.totalCost > 0 && h.totalReturn != null ? (h.totalReturn / h.totalCost) * 100 : null;

        return (
          <DataCard key={h.id} onClick={() => onSelect(h)}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-gray-900">{h.assetName ?? "\u2014"}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                  {h.assetTicker && <span>{h.assetTicker}</span>}
                  {h.assetTypeName && <Badge>{h.assetTypeName}</Badge>}
                </div>
                {h.accountName && <div className="mt-0.5 text-xs text-gray-400">{h.accountName}</div>}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{formatCurrency(displayValue, displayCcy)}</div>
                {showConverted && (
                  <div className="text-xs text-gray-400">{formatCurrency(h.currentValue, h.currency)}</div>
                )}
                {h.totalReturn != null && (
                  <div className={`text-xs ${h.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {h.totalReturn >= 0 ? "+" : ""}
                    {formatCurrency(h.totalReturn, h.currency).replace("-", "\u2011")}
                    {returnPct != null && (
                      <> ({returnPct >= 0 ? "+" : ""}{returnPct.toFixed(1)}%)</>
                    )}
                  </div>
                )}
              </div>
            </div>
          </DataCard>
        );
      })}
    </div>
  );
}

function DesktopHoldingsTable({
  holdings,
  isAllMode,
  displayCurrency,
}: {
  holdings: HoldingEntity[];
  isAllMode: boolean;
  displayCurrency?: string | null;
}) {
  const showConvertedCol = isAllMode && holdings.some((h) => h.convertedValue != null);

  return (
    <Table.Container>
      <Table>
        <Table.Header
          items={[
            { node: "Asset", hideOnMobile: false },
            { node: "Account", hideOnMobile: true },
            { node: "Type", hideOnMobile: true },
            ...(showConvertedCol
              ? [{ node: `Value (${displayCurrency})`, hideOnMobile: false, className: "text-right" }]
              : []),
            { node: "Current Value", hideOnMobile: false, className: "text-right" },
            { node: "Total Return", hideOnMobile: false, className: "text-right" },
          ]}
        />
        <Table.Body
          items={holdings.map((h) => {
            const returnPct = h.totalCost > 0 && h.totalReturn != null ? (h.totalReturn / h.totalCost) * 100 : null;
            return {
              row: [
                {
                  node: (
                    <div>
                      <div className="font-medium text-gray-900">{h.assetName ?? "\u2014"}</div>
                      {h.assetTicker && <div className="text-xs text-gray-400">{h.assetTicker}</div>}
                    </div>
                  ),
                  hideOnMobile: false,
                },
                { node: h.accountName ?? "\u2014", hideOnMobile: true },
                {
                  node: h.assetTypeName ? <Badge>{h.assetTypeName}</Badge> : "\u2014",
                  hideOnMobile: true,
                },
                ...(showConvertedCol
                  ? [
                      {
                        node: (
                          <span className="whitespace-nowrap font-medium">
                            {h.convertedValue != null
                              ? formatCurrency(h.convertedValue, displayCurrency!)
                              : "\u2014"}
                          </span>
                        ),
                        hideOnMobile: false,
                        className: "text-right",
                      },
                    ]
                  : []),
                {
                  node: (
                    <span className="whitespace-nowrap font-medium">
                      {formatCurrency(h.currentValue, h.currency)}
                    </span>
                  ),
                  hideOnMobile: false,
                  className: "text-right",
                },
                {
                  node:
                    h.totalReturn != null ? (
                      <span
                        className={`whitespace-nowrap ${h.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {h.totalReturn >= 0 ? "+" : ""}
                        {formatCurrency(h.totalReturn, h.currency).replace("-", "\u2011")}
                        {returnPct != null && (
                          <> ({returnPct >= 0 ? "+" : ""}{returnPct.toFixed(1)}%)</>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-400">{"\u2014"}</span>
                    ),
                  hideOnMobile: false,
                  className: "text-right",
                },
              ],
            };
          })}
        />
      </Table>
    </Table.Container>
  );
}

function PortfolioHero({
  nativeTotals,
  convertedSummary,
  showConverted,
}: {
  nativeTotals: { currency: string; currentValue: number; unrealizedGain: number; totalCost: number }[];
  convertedSummary: { currency: string; currentValue: number | null; unrealizedGain: number | null } | null;
  showConverted: boolean;
}) {
  if (nativeTotals.length === 0 && !showConverted) return null;

  return (
    <div className="px-1">
      {/* Display currency grand total (primary number when in All mode) */}
      {showConverted && convertedSummary && convertedSummary.currentValue != null && (
        <div className="mb-3">
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(convertedSummary.currentValue, convertedSummary.currency)}
          </div>
          <div className="mt-0.5 text-xs text-gray-400">Total portfolio in {convertedSummary.currency}</div>
        </div>
      )}

      {/* Native currency breakdowns */}
      <div className={`space-y-2 ${showConverted ? "" : ""}`}>
        {nativeTotals.map((t) => {
          const returnPct = t.totalCost > 0 ? (t.unrealizedGain / t.totalCost) * 100 : 0;
          const isFirst = !showConverted && t === nativeTotals[0];

          return (
            <div key={t.currency}>
              <div className={isFirst ? "text-3xl font-bold text-gray-900" : "text-lg font-semibold text-gray-900"}>
                {formatCurrency(t.currentValue, t.currency)}
              </div>
              <div
                className={`mt-0.5 text-sm font-medium ${t.unrealizedGain >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {t.unrealizedGain >= 0 ? "+" : ""}
                {formatCurrency(t.unrealizedGain, t.currency).replace("-", "\u2011")} ({returnPct >= 0 ? "+" : ""}
                {returnPct.toFixed(1)}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
