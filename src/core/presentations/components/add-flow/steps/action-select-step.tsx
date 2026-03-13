"use client";

import { ActionType, ACTION_TYPE_OPTIONS } from "@/core/resources/action-type-config";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import {
  ShoppingCartIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  ArrowPathIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";

const ACTION_ICONS: Record<ActionType, React.ComponentType<{ className?: string }>> = {
  buy: ShoppingCartIcon,
  sell: ArrowTrendingDownIcon,
  deposit: BanknotesIcon,
  dividend: CurrencyDollarIcon,
  interest: CalculatorIcon,
  redemption: ArrowPathIcon,
  other: EllipsisHorizontalCircleIcon,
};

type ActionSelectStepProps = {
  onSelect: (action: ActionType) => void;
  onCancel: () => void;
};

export function ActionSelectStep({ onSelect, onCancel }: ActionSelectStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">What would you like to record?</p>
      <div className="grid grid-cols-2 gap-3">
        {ACTION_TYPE_OPTIONS.map((option) => {
          const Icon = ACTION_ICONS[option.type];
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => onSelect(option.type)}
              className="flex flex-col items-start gap-2 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-primary-300 hover:bg-primary-300/5 active:bg-primary-300/10"
            >
              <Icon className="size-5 text-primary-300" />
              <div>
                <div className="text-sm font-medium text-gray-900">{option.label}</div>
                <div className="mt-0.5 text-xs text-gray-500">{option.description}</div>
              </div>
            </button>
          );
        })}
      </div>
      <OutlinedButton type="button" onClick={onCancel}>
        Cancel
      </OutlinedButton>
    </div>
  );
}
