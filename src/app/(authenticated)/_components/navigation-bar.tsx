"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BanknotesIcon,
  RectangleStackIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  RectangleStackIcon as RectangleStackIconSolid,
  ArrowsRightLeftIcon as ArrowsRightLeftIconSolid,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { TortoLogo } from "@/core/presentations/components/torto-logo";

const NAV_ITEMS = [
  { href: "/home", label: "Dashboard", Icon: HomeIcon, ActiveIcon: HomeIconSolid },
  { href: "/wealth/accounts", label: "Accounts", Icon: BanknotesIcon, ActiveIcon: BanknotesIconSolid },
  { href: "/wealth/assets", label: "Assets", Icon: RectangleStackIcon, ActiveIcon: RectangleStackIconSolid },
  { href: "/wealth/transactions", label: "Transactions", Icon: ArrowsRightLeftIcon, ActiveIcon: ArrowsRightLeftIconSolid },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-[256px] flex-col gap-y-8 border-r border-r-neutral-200 bg-gray-50 p-6">
      <TortoLogo className="w-28" />
      <div className="flex flex-1 flex-col gap-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = isActive ? item.ActiveIcon : item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-x-3 rounded-md p-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-300/10 text-primary-300"
                  : "text-neutral-300 hover:bg-primary-300/5 hover:text-primary-300",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
