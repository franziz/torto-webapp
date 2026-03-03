"use client";

import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <div className="flex items-center justify-between border-b border-b-neutral-200 px-6 py-3">
      <div />
      <UserButton afterSignOutUrl="/sign-in" />
    </div>
  );
}
