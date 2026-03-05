"use client";

import { useState } from "react";
import { useListAssets } from "@/features/asset/presentation/hooks/use-list-assets";
import { useListAccounts } from "@/features/account/presentation/hooks/use-list-accounts";
import { useListAssetTypes } from "@/features/asset-type/presentation/hooks/use-list-asset-types";
import { SectionCard } from "@/core/presentations/components/section-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { Table } from "@/core/presentations/components/table/table";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { SelectInput } from "@/core/presentations/components/select-input";
import { Badge } from "@/core/presentations/components/badge";
import { DataCard, DataCardRow } from "@/core/presentations/components/data-card";
import { Modal } from "@/core/presentations/components/modal";
import { CreateAssetModal } from "@/app/(authenticated)/wealth/assets/_components/create-asset-modal";
import { useIsMobile } from "@/core/presentations/hooks/use-is-mobile";
import { AssetEntity } from "@/features/asset/domain/entities/asset";

export function AssetListImpl() {
  const isMobile = useIsMobile();
  const [accountFilter, setAccountFilter] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetEntity | null>(null);

  const { assets, loading, error } = useListAssets({
    page: 1,
    limit: 50,
    accountId: accountFilter || undefined,
    assetTypeId: assetTypeFilter || undefined,
  });
  const { accounts } = useListAccounts({ page: 1, limit: 100 });
  const { assetTypes } = useListAssetTypes({ page: 1, limit: 100 });

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

  const accountOptions = (accounts ?? []).map((a) => ({ label: a.name, value: a.id }));
  const assetTypeOptions = (assetTypes ?? []).map((t) => ({ label: t.name, value: t.id }));

  return (
    <>
      <div className="flex flex-wrap items-end gap-4">
        <SelectInput
          label="Account"
          options={[{ label: "All Accounts", value: "" }, ...accountOptions]}
          value={accountFilter}
          onChange={setAccountFilter}
          className="w-full sm:w-48"
        />
        <SelectInput
          label="Asset Type"
          options={[{ label: "All Types", value: "" }, ...assetTypeOptions]}
          value={assetTypeFilter}
          onChange={setAssetTypeFilter}
          className="w-full sm:w-48"
        />
      </div>

      <SectionCard
        title="All Assets"
        headerAction={
          <FilledButton type="button" onClick={() => setCreateOpen(true)} className="w-auto">
            Add Asset
          </FilledButton>
        }
        bodyClassName=""
      >
        {assets.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No assets found.</p>
        ) : isMobile ? (
          <div className="space-y-3 p-4">
            {assets.map((asset) => (
              <DataCard key={asset.id} onClick={() => setSelectedAsset(asset)}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{asset.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                      {asset.ticker && <span>{asset.ticker}</span>}
                      {asset.assetTypeName && <Badge>{asset.assetTypeName}</Badge>}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">{asset.accountName ?? "\u2014"}</div>
                </div>
              </DataCard>
            ))}
          </div>
        ) : (
          <Table.Container>
            <Table>
              <Table.Header
                items={[
                  { node: "Name", hideOnMobile: false },
                  { node: "Ticker", hideOnMobile: true },
                  { node: "Asset Type", hideOnMobile: true },
                  { node: "Account", hideOnMobile: true },
                  { node: "Country", hideOnMobile: true },
                  { node: "Currency", hideOnMobile: true },
                ]}
              />
              <Table.Body
                items={assets.map((asset) => ({
                  row: [
                    {
                      node: <span className="font-medium text-gray-900">{asset.name}</span>,
                      hideOnMobile: false,
                    },
                    { node: asset.ticker ?? "\u2014", hideOnMobile: true },
                    {
                      node: asset.assetTypeName ? <Badge>{asset.assetTypeName}</Badge> : "\u2014",
                      hideOnMobile: true,
                    },
                    { node: asset.accountName ?? "\u2014", hideOnMobile: true },
                    { node: asset.accountCountry ?? "\u2014", hideOnMobile: true },
                    { node: asset.accountCurrency ?? "\u2014", hideOnMobile: true },
                  ],
                }))}
              />
            </Table>
          </Table.Container>
        )}
      </SectionCard>

      {selectedAsset && (
        <Modal open={!!selectedAsset} onClose={() => setSelectedAsset(null)} title={selectedAsset.name}>
          <div className="space-y-3">
            <DataCardRow label="Ticker" value={selectedAsset.ticker ?? "\u2014"} />
            <DataCardRow label="Asset Type" value={selectedAsset.assetTypeName ?? "\u2014"} />
            <DataCardRow label="Account" value={selectedAsset.accountName ?? "\u2014"} />
            <DataCardRow label="Country" value={selectedAsset.accountCountry ?? "\u2014"} />
            <DataCardRow label="Currency" value={selectedAsset.accountCurrency ?? "\u2014"} />
          </div>
        </Modal>
      )}

      <CreateAssetModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        accounts={accounts ?? []}
        assetTypes={assetTypes ?? []}
      />
    </>
  );
}
