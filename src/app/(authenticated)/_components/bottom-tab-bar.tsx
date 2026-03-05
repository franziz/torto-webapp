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

const TAB_ITEMS = [
  { href: "/home", label: "Dashboard", Icon: HomeIcon, ActiveIcon: HomeIconSolid },
  { href: "/wealth/accounts", label: "Accounts", Icon: BanknotesIcon, ActiveIcon: BanknotesIconSolid },
  { href: "/wealth/assets", label: "Assets", Icon: RectangleStackIcon, ActiveIcon: RectangleStackIconSolid },
  { href: "/wealth/transactions", label: "Transactions", Icon: ArrowsRightLeftIcon, ActiveIcon: ArrowsRightLeftIconSolid },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white md:hidden">
      <div className="flex items-center justify-around py-1.5">
        {TAB_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = isActive ? item.ActiveIcon : item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-0.5 px-3 py-1",
                isActive ? "text-primary-300" : "text-neutral-300",
              )}
            >
              <Icon className="size-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
