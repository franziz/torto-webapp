"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  ShoppingCartIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { PositionActionType, PositionActionConfig, getActionsForAssetType } from "@/core/resources/action-type-config";

const ACTION_ICONS: Record<PositionActionType, React.ComponentType<{ className?: string }>> = {
  buy: ShoppingCartIcon,
  sell: ArrowTrendingDownIcon,
  deposit: BanknotesIcon,
  dividend: CurrencyDollarIcon,
  interest: CalculatorIcon,
  redemption: ArrowPathIcon,
};

type PositionActionMenuProps = {
  assetTypeCode?: string;
  hasMaturityDate: boolean;
  hasFaceValue: boolean;
  onAction: (actionType: PositionActionType) => void;
};

export function PositionActionMenu({ assetTypeCode, hasMaturityDate, hasFaceValue, onAction }: PositionActionMenuProps) {
  const actions = getActionsForAssetType(assetTypeCode, { hasMaturityDate, hasFaceValue });

  if (actions.length === 0) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="flex items-center rounded-md p-1 text-gray-400 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300">
        <EllipsisVerticalIcon className="size-5" />
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="z-50 w-44 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
      >
        {actions.map((action) => (
          <PositionMenuItem key={action.type} action={action} onAction={onAction} />
        ))}
      </MenuItems>
    </Menu>
  );
}

function PositionMenuItem({
  action,
  onAction,
}: {
  action: PositionActionConfig;
  onAction: (actionType: PositionActionType) => void;
}) {
  const Icon = ACTION_ICONS[action.type];
  return (
    <MenuItem>
      <button
        type="button"
        onClick={() => onAction(action.type)}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 data-[focus]:bg-gray-50 data-[focus]:text-gray-900"
      >
        <Icon className="size-4" />
        {action.label}
      </button>
    </MenuItem>
  );
}

type PositionActionButtonsProps = {
  assetTypeCode?: string;
  hasMaturityDate: boolean;
  hasFaceValue: boolean;
  onAction: (actionType: PositionActionType) => void;
};

export function PositionActionButtons({ assetTypeCode, hasMaturityDate, hasFaceValue, onAction }: PositionActionButtonsProps) {
  const actions = getActionsForAssetType(assetTypeCode, { hasMaturityDate, hasFaceValue });

  if (actions.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
      {actions.map((action) => {
        const Icon = ACTION_ICONS[action.type];
        const isRedeem = action.type === "redemption";
        return (
          <button
            key={action.type}
            type="button"
            onClick={() => onAction(action.type)}
            className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium ${
              isRedeem
                ? "bg-primary-300 text-white hover:bg-primary-400"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Icon className="size-4" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
