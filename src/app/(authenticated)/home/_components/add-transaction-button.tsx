"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { AddTransactionWizard } from "@/core/presentations/components/add-transaction-wizard/add-transaction-wizard";

export function AddTransactionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FilledButton type="button" onClick={() => setOpen(true)} className="w-auto">
        <span className="flex items-center gap-1.5">
          <PlusIcon className="size-4" />
          Add Transaction
        </span>
      </FilledButton>
      <AddTransactionWizard open={open} onClose={() => setOpen(false)} />
    </>
  );
}
