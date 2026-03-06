"use client";

import { useState } from "react";
import { Modal } from "@/core/presentations/components/modal";
import { TextInput } from "@/core/presentations/components/text-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TextareaInput } from "@/core/presentations/components/textarea-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { useUpdateAccount } from "@/features/account/presentation/hooks/use-update-account";
import { UpdateAccountUseCaseParams } from "@/features/account/domain/usecases/update-account.usecases";
import { AccountEntity } from "@/features/account/domain/entities/account";

type EditAccountModalProps = {
  account: AccountEntity;
  open: boolean;
  onClose: () => void;
};

const COUNTRY_OPTIONS = [
  { label: "Singapore", value: "SG" },
  { label: "Indonesia", value: "ID" },
];

const CURRENCY_OPTIONS = [
  { label: "SGD", value: "SGD" },
  { label: "IDR", value: "IDR" },
];

export function EditAccountModal(props: EditAccountModalProps) {
  const { trigger, loading } = useUpdateAccount();
  const [name, setName] = useState(props.account.name);
  const [country, setCountry] = useState(props.account.country);
  const [currency, setCurrency] = useState(props.account.currency);
  const [description, setDescription] = useState(props.account.description ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await trigger(
      new UpdateAccountUseCaseParams({
        id: props.account.id,
        name,
        country,
        currency,
        description: description || undefined,
      }),
    );
    props.onClose();
  };

  return (
    <Modal open={props.open} onClose={props.onClose} title="Edit Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput label="Name" value={name} onChange={setName} required placeholder="Account name" />
        <SelectInput
          label="Country"
          options={COUNTRY_OPTIONS}
          value={country}
          onChange={setCountry}
          required
          placeholder="Select country"
        />
        <SelectInput
          label="Currency"
          options={CURRENCY_OPTIONS}
          value={currency}
          onChange={setCurrency}
          required
          placeholder="Select currency"
        />
        <TextareaInput
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Optional description"
        />
        <div className="flex gap-x-3 pt-2">
          <OutlinedButton type="button" onClick={props.onClose}>
            Cancel
          </OutlinedButton>
          <FilledButton type="submit" loading={loading}>
            Save
          </FilledButton>
        </div>
      </form>
    </Modal>
  );
}
