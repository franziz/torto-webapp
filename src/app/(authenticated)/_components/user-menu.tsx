"use client";

import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react";
import { Cog6ToothIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useSignOut } from "@/features/authentication/presentation/hooks/use-sign-out";
import { UserAvatar } from "@/core/presentations/components/user-avatar";

export function UserMenu() {
  const { user } = useUser();
  const { trigger: signOut } = useSignOut();

  const fullName = user?.fullName ?? null;
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const imageUrl = user?.imageUrl ?? null;

  return (
    <Menu>
      <MenuButton className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300">
        <UserAvatar imageUrl={imageUrl} fullName={fullName} size="sm" />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className="z-50 w-60 rounded-lg border border-neutral-200 bg-white shadow-lg"
      >
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <UserAvatar imageUrl={imageUrl} fullName={fullName} size="md" />
            <div className="min-w-0">
              {fullName && <p className="truncate text-sm font-semibold text-neutral-500">{fullName}</p>}
              {email && <p className="truncate text-sm text-neutral-300">{email}</p>}
            </div>
          </div>
        </div>

        <MenuSeparator className="border-t border-neutral-200" />

        <div className="py-1">
          <MenuItem>
            <Link
              href="/settings"
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-500 data-[focus]:bg-primary-300/5 data-[focus]:text-primary-300"
            >
              <Cog6ToothIcon className="size-5" />
              Settings
            </Link>
          </MenuItem>
        </div>

        <MenuSeparator className="border-t border-neutral-200" />

        <div className="py-1">
          <MenuItem>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-500 data-[focus]:bg-primary-300/5 data-[focus]:text-primary-300"
            >
              <ArrowRightStartOnRectangleIcon className="size-5" />
              Log out
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
