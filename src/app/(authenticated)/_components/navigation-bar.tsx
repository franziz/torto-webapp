"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, CubeIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid, CubeIcon as CubeIconSolid } from "@heroicons/react/24/solid";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/home", label: "Dashboard", Icon: HomeIcon, ActiveIcon: HomeIconSolid },
  { href: "/items", label: "Items", Icon: CubeIcon, ActiveIcon: CubeIconSolid },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-[256px] flex-col gap-y-8 border-r border-r-neutral-200 bg-gray-50 p-6">
      <div className="text-xl font-bold text-primary-300">torto-webapp</div>
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
