"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { AddFlow } from "@/core/presentations/components/add-flow/add-flow";

export function AddTransactionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FilledButton type="button" onClick={() => setOpen(true)} className="w-auto">
        <span className="flex items-center gap-1.5">
          <PlusIcon className="size-4" />
          Record Activity
        </span>
      </FilledButton>
      <AddFlow open={open} onClose={() => setOpen(false)} />
    </>
  );
}
