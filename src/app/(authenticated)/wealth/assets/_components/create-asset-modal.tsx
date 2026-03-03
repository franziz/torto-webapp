"use client";

import { useState } from "react";
import { Modal } from "@/core/presentations/components/modal";
import { TextInput } from "@/core/presentations/components/text-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TextareaInput } from "@/core/presentations/components/textarea-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { useCreateAsset } from "@/features/asset/presentation/hooks/use-create-asset";
import { CreateAssetUseCaseParams } from "@/features/asset/domain/usecases/create-asset.usecases";
import { AccountEntity } from "@/features/account/domain/entities/account";
import { AssetTypeEntity } from "@/features/asset-type/domain/entities/asset-type";

type CreateAssetModalProps = {
  open: boolean;
  onClose: () => void;
  accounts: AccountEntity[];
  assetTypes: AssetTypeEntity[];
};

export function CreateAssetModal(props: CreateAssetModalProps) {
  const { trigger, loading } = useCreateAsset();
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [accountId, setAccountId] = useState("");
  const [assetTypeId, setAssetTypeId] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await trigger(
      new CreateAssetUseCaseParams({
        name,
        ticker: ticker || undefined,
        accountId,
        assetTypeId,
        description: description || undefined,
      }),
    );
    setName("");
    setTicker("");
    setAccountId("");
    setAssetTypeId("");
    setDescription("");
    props.onClose();
  };

  const accountOptions = props.accounts.map((a) => ({ label: `${a.name} (${a.currency})`, value: a.id }));
  const assetTypeOptions = props.assetTypes.map((t) => ({ label: t.name, value: t.id }));

  return (
    <Modal open={props.open} onClose={props.onClose} title="Add Asset">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput label="Name" value={name} onChange={setName} required placeholder="Asset name" />
        <TextInput label="Ticker" value={ticker} onChange={setTicker} placeholder="e.g. AAPL, VWRA" />
        <SelectInput
          label="Account"
          options={accountOptions}
          value={accountId}
          onChange={setAccountId}
          required
          placeholder="Select account"
        />
        <SelectInput
          label="Asset Type"
          options={assetTypeOptions}
          value={assetTypeId}
          onChange={setAssetTypeId}
          required
          placeholder="Select asset type"
        />
        <TextareaInput label="Description" value={description} onChange={setDescription} placeholder="Optional description" />
        <div className="flex gap-x-3 pt-2">
          <OutlinedButton type="button" onClick={props.onClose}>
            Cancel
          </OutlinedButton>
          <FilledButton type="submit" loading={loading}>
            Create
          </FilledButton>
        </div>
      </form>
    </Modal>
  );
}
