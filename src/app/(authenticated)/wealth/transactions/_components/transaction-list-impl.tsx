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
import { CreateTransactionModal } from "@/app/(authenticated)/wealth/transactions/_components/create-transaction-modal";
import { formatCurrency } from "@/core/helpers/format-currency";
import { DateTime } from "luxon";

export function TransactionListImpl() {
  const [assetFilter, setAssetFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

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

  const assetOptions = (assets ?? []).map((a) => ({ label: `${a.name}${a.ticker ? ` (${a.ticker})` : ""}`, value: a.id }));
  const typeOptions = (transactionTypes ?? []).map((t) => ({ label: t.name, value: t.id }));

  return (
    <>
      <div className="flex flex-wrap items-end gap-4">
        <SelectInput
          label="Asset"
          options={[{ label: "All Assets", value: "" }, ...assetOptions]}
          value={assetFilter}
          onChange={setAssetFilter}
          className="w-48"
        />
        <SelectInput
          label="Type"
          options={[{ label: "All Types", value: "" }, ...typeOptions]}
          value={typeFilter}
          onChange={setTypeFilter}
          className="w-48"
        />
      </div>

      <SectionCard
        title="All Transactions"
        headerAction={
          <FilledButton type="button" onClick={() => setCreateOpen(true)} className="w-auto">
            Add Transaction
          </FilledButton>
        }
        bodyClassName=""
      >
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No transactions found.</p>
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
                  { node: "Fee", hideOnMobile: true },
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
                    { node: formatCurrency(tx.fee, tx.currency), hideOnMobile: true },
                    { node: tx.currency, hideOnMobile: true },
                  ],
                }))}
              />
            </Table>
          </Table.Container>
        )}
      </SectionCard>

      <CreateTransactionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        assets={assets ?? []}
        transactionTypes={transactionTypes ?? []}
      />
    </>
  );
}
