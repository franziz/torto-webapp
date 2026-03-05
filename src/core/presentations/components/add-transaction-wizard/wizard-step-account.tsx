"use client";

import { useState } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TextInput } from "@/core/presentations/components/text-input";
import { TextareaInput } from "@/core/presentations/components/textarea-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { SegmentedToggle } from "@/core/presentations/components/segmented-toggle";
import { useCreateAccount } from "@/features/account/presentation/hooks/use-create-account";
import { CreateAccountUseCaseParams } from "@/features/account/domain/usecases/create-account.usecases";
import { AccountEntity } from "@/features/account/domain/entities/account";
import { StepMode } from "@/core/presentations/components/add-transaction-wizard/add-transaction-wizard.types";

type WizardStepAccountProps = {
  mode: StepMode;
  accounts: AccountEntity[];
  onModeChange: (mode: StepMode) => void;
  onNext: (accountId: string, currency: string) => void;
  onCancel: () => void;
};

const COUNTRY_OPTIONS = [
  { label: "Singapore", value: "SG" },
  { label: "Indonesia", value: "ID" },
];

const CURRENCY_OPTIONS = [
  { label: "SGD", value: "SGD" },
  { label: "IDR", value: "IDR" },
];

export function WizardStepAccount(props: WizardStepAccountProps) {
  const { trigger, loading } = useCreateAccount();
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const showToggle = props.accounts.length > 0;

  const handleSelectNext = () => {
    const account = props.accounts.find((a) => a.id === selectedAccountId);
    if (account) props.onNext(account.id, account.currency);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await trigger(new CreateAccountUseCaseParams({ name, country, currency, description: description || undefined }));
      if (result?.id) props.onNext(result.id, result.currency);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create account");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        An account represents a brokerage or investment account where you hold assets (e.g. Interactive Brokers, Bibit).
      </p>
      {showToggle && (
        <SegmentedToggle
          options={[
            { label: "Select Existing", value: "select" },
            { label: "Create New", value: "create" },
          ]}
          value={props.mode}
          onChange={(v) => props.onModeChange(v as StepMode)}
        />
      )}

      {props.mode === "select" ? (
        <div className="space-y-4">
          <SelectInput
            label="Account"
            options={props.accounts.map((a) => ({ label: `${a.name} (${a.currency})`, value: a.id }))}
            value={selectedAccountId}
            onChange={setSelectedAccountId}
            placeholder="Select an account"
          />
          <div className="flex gap-x-3 pt-2">
            <OutlinedButton type="button" onClick={props.onCancel}>
              Cancel
            </OutlinedButton>
            <FilledButton type="button" onClick={handleSelectNext} disabled={!selectedAccountId}>
              Next
            </FilledButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <ErrorDisplay>{error}</ErrorDisplay>}
          <TextInput label="Name" value={name} onChange={setName} required placeholder="e.g. My Singapore Account" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectInput label="Country" options={COUNTRY_OPTIONS} value={country} onChange={setCountry} required placeholder="Select country" />
            <SelectInput label="Currency" options={CURRENCY_OPTIONS} value={currency} onChange={setCurrency} required placeholder="Select currency" />
          </div>
          <TextareaInput label="Description" value={description} onChange={setDescription} placeholder="Optional description" />
          <div className="flex gap-x-3 pt-2">
            <OutlinedButton type="button" onClick={props.onCancel}>
              Cancel
            </OutlinedButton>
            <FilledButton type="submit" loading={loading}>
              Create & Continue
            </FilledButton>
          </div>
        </form>
      )}
    </div>
  );
}
