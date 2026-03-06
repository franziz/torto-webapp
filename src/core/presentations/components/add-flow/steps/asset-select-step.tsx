"use client";

import { useState, useMemo } from "react";
import { ActionType } from "@/core/resources/action-type-config";
import { useListAssets } from "@/features/asset/presentation/hooks/use-list-assets";
import { useListAccounts } from "@/features/account/presentation/hooks/use-list-accounts";
import { useListPositions } from "@/features/position/presentation/hooks/use-list-positions";
import { useListAssetTypes } from "@/features/asset-type/presentation/hooks/use-list-asset-types";
import { useCreateAsset } from "@/features/asset/presentation/hooks/use-create-asset";
import { CreateAssetUseCaseParams } from "@/features/asset/domain/usecases/create-asset.usecases";
import { TextInput } from "@/core/presentations/components/text-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { DataCard } from "@/core/presentations/components/data-card";
import { Badge } from "@/core/presentations/components/badge";
import { PlusIcon } from "@heroicons/react/20/solid";

type AssetSelectStepProps = {
  actionType: ActionType;
  onSelect: (params: { assetId: string; assetTypeCode: string; currency: string; accountId?: string }) => void;
  onBack: () => void;
};

export function AssetSelectStep({ actionType, onSelect, onBack }: AssetSelectStepProps) {
  if (actionType === "deposit") {
    return <DepositAccountSelect onSelect={onSelect} onBack={onBack} />;
  }
  if (actionType === "sell" || actionType === "dividend" || actionType === "interest") {
    return <HoldingSelect actionType={actionType} onSelect={onSelect} onBack={onBack} />;
  }
  return <AssetSearch onSelect={onSelect} onBack={onBack} />;
}

function DepositAccountSelect({
  onSelect,
  onBack,
}: {
  onSelect: AssetSelectStepProps["onSelect"];
  onBack: () => void;
}) {
  const { accounts, loading } = useListAccounts({ page: 1, limit: 100 });
  const { assets } = useListAssets({ page: 1, limit: 200 });
  const { assetTypes } = useListAssetTypes({ page: 1, limit: 100 });
  const { trigger: createAsset, loading: creating } = useCreateAsset();
  const [error, setError] = useState<string | null>(null);

  const handleSelectAccount = async (accountId: string) => {
    setError(null);
    const account = accounts?.find((a) => a.id === accountId);
    if (!account) return;

    const cashAsset = assets?.find(
      (a) => a.accountId === accountId && (a.assetTypeCode === "cash" || a.assetTypeCode === "savings"),
    );

    if (cashAsset) {
      onSelect({
        assetId: cashAsset.id,
        assetTypeCode: cashAsset.assetTypeCode ?? "cash",
        currency: account.currency,
        accountId,
      });
      return;
    }

    const cashType = assetTypes?.find((t) => t.code === "cash");
    if (!cashType) {
      setError("No 'cash' asset type found. Please create one in Settings.");
      return;
    }

    try {
      const newAsset = await createAsset(
        new CreateAssetUseCaseParams({
          accountId,
          assetTypeId: cashType.id,
          name: `${account.name} Cash`,
        }),
      );
      if (newAsset) {
        onSelect({
          assetId: newAsset.id,
          assetTypeCode: "cash",
          currency: account.currency,
          accountId,
        });
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to create cash asset");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Select the account to deposit into:</p>
      {error && <ErrorDisplay>{error}</ErrorDisplay>}
      {!accounts || accounts.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">No accounts found. Create one in Settings first.</p>
      ) : (
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {accounts.map((account) => (
            <DataCard key={account.id} onClick={() => !creating && handleSelectAccount(account.id)}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{account.name}</div>
                  <div className="mt-0.5 text-xs text-gray-400">
                    {account.country} &middot; {account.currency}
                  </div>
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      )}
      {creating && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Spinner /> Setting up cash asset...
        </div>
      )}
      <OutlinedButton type="button" onClick={onBack}>
        Back
      </OutlinedButton>
    </div>
  );
}

function HoldingSelect({
  actionType,
  onSelect,
  onBack,
}: {
  actionType: ActionType;
  onSelect: AssetSelectStepProps["onSelect"];
  onBack: () => void;
}) {
  const { positions, loading } = useListPositions({ page: 1, limit: 100 });
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!positions) return [];
    if (!search.trim()) return positions;
    const q = search.toLowerCase();
    return positions.filter(
      (p) =>
        (p.assetName && p.assetName.toLowerCase().includes(q)) ||
        (p.assetTicker && p.assetTicker.toLowerCase().includes(q)),
    );
  }, [positions, search]);

  const labels: Record<string, string> = {
    sell: "Select the holding to sell:",
    dividend: "Select the holding that received a dividend:",
    interest: "Select the holding that earned interest:",
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">{labels[actionType]}</p>
      <TextInput label="" placeholder="Search holdings..." value={search} onChange={setSearch} />
      {filtered.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">No holdings found.</p>
      ) : (
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {filtered.map((pos) => (
            <DataCard
              key={pos.id}
              onClick={() =>
                onSelect({
                  assetId: pos.assetId,
                  assetTypeCode: pos.assetTypeCode ?? "",
                  currency: pos.currency,
                })
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{pos.assetName ?? pos.assetTicker ?? "\u2014"}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                    {pos.assetTicker && <span>{pos.assetTicker}</span>}
                    {pos.assetTypeName && <Badge>{pos.assetTypeName}</Badge>}
                  </div>
                </div>
                <div className="text-right text-xs text-gray-400">
                  {pos.totalUnits.toLocaleString()} units &middot; {pos.currency}
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      )}
      <OutlinedButton type="button" onClick={onBack}>
        Back
      </OutlinedButton>
    </div>
  );
}

function AssetSearch({
  onSelect,
  onBack,
}: {
  onSelect: AssetSelectStepProps["onSelect"];
  onBack: () => void;
}) {
  const { assets, loading } = useListAssets({ page: 1, limit: 100 });
  const { accounts } = useListAccounts({ page: 1, limit: 100 });
  const { assetTypes } = useListAssetTypes({ page: 1, limit: 100 });
  const { trigger: createAsset, loading: creating } = useCreateAsset();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTicker, setNewTicker] = useState("");
  const [newAccountId, setNewAccountId] = useState("");
  const [newAssetTypeId, setNewAssetTypeId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!assets) return [];
    if (!search.trim()) return assets;
    const q = search.toLowerCase();
    return assets.filter(
      (a) => a.name.toLowerCase().includes(q) || (a.ticker && a.ticker.toLowerCase().includes(q)),
    );
  }, [assets, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newName || !newAccountId || !newAssetTypeId) return;
    try {
      const newAsset = await createAsset(
        new CreateAssetUseCaseParams({
          accountId: newAccountId,
          assetTypeId: newAssetTypeId,
          name: newName,
          ticker: newTicker || undefined,
        }),
      );
      if (newAsset) {
        const account = accounts?.find((a) => a.id === newAccountId);
        onSelect({
          assetId: newAsset.id,
          assetTypeCode: newAsset.assetTypeCode ?? "",
          currency: account?.currency ?? "",
          accountId: newAccountId,
        });
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to create asset");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const accountOptions = (accounts ?? []).map((a) => ({ label: `${a.name} (${a.currency})`, value: a.id }));
  const assetTypeOptions = (assetTypes ?? []).map((t) => ({ label: t.name, value: t.id }));

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Search for an existing asset or create a new one:</p>
      <TextInput label="" placeholder="Search assets..." value={search} onChange={setSearch} />
      {filtered.length === 0 && !showCreate ? (
        <p className="py-4 text-center text-sm text-gray-500">No assets found.</p>
      ) : (
        !showCreate && (
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {filtered.map((asset) => (
              <DataCard
                key={asset.id}
                onClick={() =>
                  onSelect({
                    assetId: asset.id,
                    assetTypeCode: asset.assetTypeCode ?? "",
                    currency: asset.accountCurrency ?? "",
                    accountId: asset.accountId,
                  })
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{asset.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                      {asset.ticker && <span>{asset.ticker}</span>}
                      {asset.assetTypeName && <Badge>{asset.assetTypeName}</Badge>}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">{asset.accountName ?? ""}</div>
                </div>
              </DataCard>
            ))}
          </div>
        )
      )}

      {!showCreate ? (
        <OutlinedButton type="button" onClick={() => setShowCreate(true)}>
          <span className="flex items-center gap-1.5">
            <PlusIcon className="size-4" />
            Create New Asset
          </span>
        </OutlinedButton>
      ) : (
        <form onSubmit={handleCreate} className="space-y-3 rounded-lg border border-gray-200 p-4">
          <div className="text-sm font-medium text-gray-900">New Asset</div>
          {error && <ErrorDisplay>{error}</ErrorDisplay>}
          <TextInput label="Name" value={newName} onChange={setNewName} required placeholder="e.g. Apple Inc." />
          <TextInput label="Ticker" value={newTicker} onChange={setNewTicker} placeholder="e.g. AAPL (optional)" />
          <SelectInput
            label="Account"
            options={accountOptions}
            value={newAccountId}
            onChange={setNewAccountId}
            required
            placeholder="Select account"
          />
          <SelectInput
            label="Asset Type"
            options={assetTypeOptions}
            value={newAssetTypeId}
            onChange={setNewAssetTypeId}
            required
            placeholder="Select type"
          />
          <div className="flex gap-x-3">
            <OutlinedButton type="button" onClick={() => setShowCreate(false)}>
              Cancel
            </OutlinedButton>
            <FilledButton type="submit" loading={creating}>
              Create & Select
            </FilledButton>
          </div>
        </form>
      )}

      <OutlinedButton type="button" onClick={onBack}>
        Back
      </OutlinedButton>
    </div>
  );
}
