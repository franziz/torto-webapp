"use client";

import { useState } from "react";
import { Modal } from "@/core/presentations/components/modal";
import { TextInput } from "@/core/presentations/components/text-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TextareaInput } from "@/core/presentations/components/textarea-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { useCreateAccount } from "@/features/account/presentation/hooks/use-create-account";
import { CreateAccountUseCaseParams } from "@/features/account/domain/usecases/create-account.usecases";

type CreateAccountModalProps = {
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

export function CreateAccountModal(props: CreateAccountModalProps) {
  const { trigger, loading } = useCreateAccount();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await trigger(
      new CreateAccountUseCaseParams({
        name,
        country,
        currency,
        description: description || undefined,
      }),
    );
    setName("");
    setCountry("");
    setCurrency("");
    setDescription("");
    props.onClose();
  };

  return (
    <Modal open={props.open} onClose={props.onClose} title="Add Account">
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
            Create
          </FilledButton>
        </div>
      </form>
    </Modal>
  );
}
