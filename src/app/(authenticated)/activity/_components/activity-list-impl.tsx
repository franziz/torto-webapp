"use client";

import { useState } from "react";
import { useListTransactions } from "@/features/transaction/presentation/hooks/use-list-transactions";
import { useListAssets } from "@/features/asset/presentation/hooks/use-list-assets";
import { useListTransactionTypes } from "@/features/transaction-type/presentation/hooks/use-list-transaction-types";
import { SectionCard } from "@/core/presentations/components/section-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { Table } from "@/core/presentations/components/table/table";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { SelectInput } from "@/core/presentations/components/select-input";
import { Badge } from "@/core/presentations/components/badge";
import { DataCard, DataCardRow } from "@/core/presentations/components/data-card";
import { Modal } from "@/core/presentations/components/modal";
import { AddFlow } from "@/core/presentations/components/add-flow/add-flow";
import { formatCurrency } from "@/core/helpers/format-currency";
import { useIsMobile } from "@/core/presentations/hooks/use-is-mobile";
import { TransactionEntity } from "@/features/transaction/domain/entities/transaction";
import { DateTime } from "luxon";

export function ActivityListImpl() {
  const isMobile = useIsMobile();
  const [assetFilter, setAssetFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionEntity | null>(null);

  const { transactions, loading, error } = useListTransactions({
    page: 1,
    limit: 50,
    assetId: assetFilter || undefined,
    transactionTypeId: typeFilter || undefined,
  });
  const { assets } = useListAssets({ page: 1, limit: 100 });
  const { transactionTypes } = useListTransactionTypes({ page: 1, limit: 100 });

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

  const assetOptions = (assets ?? []).map((a) => ({
    label: `${a.name}${a.ticker ? ` (${a.ticker})` : ""}`,
    value: a.id,
  }));
  const typeOptions = (transactionTypes ?? []).map((t) => ({ label: t.name, value: t.id }));

  return (
    <>
      <div className="flex flex-wrap items-end gap-4">
        <SelectInput
          label="Asset"
          options={[{ label: "All Assets", value: "" }, ...assetOptions]}
          value={assetFilter}
          onChange={setAssetFilter}
          className="w-full sm:w-48"
        />
        <SelectInput
          label="Type"
          options={[{ label: "All Types", value: "" }, ...typeOptions]}
          value={typeFilter}
          onChange={setTypeFilter}
          className="w-full sm:w-48"
        />
      </div>

      <SectionCard
        title="All Activity"
        headerAction={
          <FilledButton type="button" onClick={() => setAddOpen(true)} className="w-auto">
            Record Activity
          </FilledButton>
        }
        bodyClassName=""
      >
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No activity found.</p>
        ) : isMobile ? (
          <div className="space-y-3 p-4">
            {transactions.map((tx) => (
              <DataCard key={tx.id} onClick={() => setSelectedTx(tx)}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{tx.assetName ?? "\u2014"}</div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">
                        {tx.transactionDate.toLocaleString(DateTime.DATE_MED)}
                      </span>
                      {tx.transactionTypeName && <Badge>{tx.transactionTypeName}</Badge>}
                    </div>
                  </div>
                  <div className="text-sm font-medium">{formatCurrency(tx.totalAmount, tx.currency)}</div>
                </div>
              </DataCard>
            ))}
          </div>
        ) : (
          <Table.Container>
            <Table>
              <Table.Header
                items={[
                  { node: "Date", hideOnMobile: false },
                  { node: "Asset", hideOnMobile: false },
                  { node: "Ticker", hideOnMobile: true },
                  { node: "Type", hideOnMobile: true },
                  { node: "Units", hideOnMobile: true },
                  { node: "Price/Unit", hideOnMobile: true },
                  { node: "Total", hideOnMobile: false },
                  { node: "Currency", hideOnMobile: true },
                ]}
              />
              <Table.Body
                items={transactions.map((tx) => ({
                  row: [
                    {
                      node: tx.transactionDate.toLocaleString(DateTime.DATE_MED),
                      hideOnMobile: false,
                    },
                    {
                      node: <span className="font-medium text-gray-900">{tx.assetName ?? "\u2014"}</span>,
                      hideOnMobile: false,
                    },
                    { node: tx.assetTicker ?? "\u2014", hideOnMobile: true },
                    {
                      node: tx.transactionTypeName ? <Badge>{tx.transactionTypeName}</Badge> : "\u2014",
                      hideOnMobile: true,
                    },
                    { node: tx.units.toLocaleString(), hideOnMobile: true },
                    { node: formatCurrency(tx.pricePerUnit, tx.currency), hideOnMobile: true },
                    {
                      node: <span className="font-medium">{formatCurrency(tx.totalAmount, tx.currency)}</span>,
                      hideOnMobile: false,
                    },
                    { node: tx.currency, hideOnMobile: true },
                  ],
                }))}
              />
            </Table>
          </Table.Container>
        )}
      </SectionCard>

      {selectedTx && (
        <Modal
          open={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          title={selectedTx.assetName ?? "Activity Details"}
        >
          <div className="space-y-3">
            <DataCardRow label="Date" value={selectedTx.transactionDate.toLocaleString(DateTime.DATE_MED)} />
            <DataCardRow label="Type" value={selectedTx.transactionTypeName ?? "\u2014"} />
            <DataCardRow label="Units" value={selectedTx.units.toLocaleString()} />
            <DataCardRow label="Price/Unit" value={formatCurrency(selectedTx.pricePerUnit, selectedTx.currency)} />
            <DataCardRow label="Total" value={formatCurrency(selectedTx.totalAmount, selectedTx.currency)} />
            <DataCardRow label="Currency" value={selectedTx.currency} />
            {selectedTx.notes && <DataCardRow label="Notes" value={selectedTx.notes} />}
          </div>
        </Modal>
      )}

      <AddFlow open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
