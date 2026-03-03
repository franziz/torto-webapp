"use client";

import { UserMenu } from "@/app/(authenticated)/_components/user-menu";

export function Header() {
  return (
    <div className="flex items-center justify-between border-b border-b-neutral-200 px-6 py-3">
      <div />
      <UserMenu />
    </div>
  );
}
