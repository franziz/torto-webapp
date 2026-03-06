"use client";

import { useState } from "react";
import { SegmentedToggle } from "@/core/presentations/components/segmented-toggle";
import { AccountListImpl } from "@/app/(authenticated)/settings/_components/accounts/account-list-impl";
import { AssetListImpl } from "@/app/(authenticated)/settings/_components/assets/asset-list-impl";

const SETTINGS_TABS = [
  { label: "Accounts", value: "accounts" },
  { label: "Assets", value: "assets" },
];

export function SettingsContent() {
  const [tab, setTab] = useState("accounts");

  return (
    <div className="space-y-6">
      <SegmentedToggle options={SETTINGS_TABS} value={tab} onChange={setTab} />
      {tab === "accounts" ? <AccountListImpl /> : <AssetListImpl />}
    </div>
  );
}
