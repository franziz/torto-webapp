"use client";

import { UserMenu } from "@/app/(authenticated)/_components/user-menu";
import { TortoLogo } from "@/core/presentations/components/torto-logo";

export function Header() {
  return (
    <div className="flex items-center justify-between border-b border-b-neutral-200 px-4 py-3 md:px-6">
      <div className="md:hidden">
        <TortoLogo className="w-20" />
      </div>
      <div className="hidden md:block" />
      <UserMenu />
    </div>
  );
}
