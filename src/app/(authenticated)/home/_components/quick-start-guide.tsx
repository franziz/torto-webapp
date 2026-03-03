"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  BanknotesIcon,
  BriefcaseIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { TortoLogo } from "@/core/presentations/components/torto-logo";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";

type QuickStartGuideProps = {
  open: boolean;
  onDismiss: () => void;
};

const STEPS = [
  {
    icon: BanknotesIcon,
    title: "Create an Account",
    description:
      "Start by adding your broker accounts (e.g. IBKR, Tiger Brokers), bank accounts (e.g. DBS), or any financial account where your assets are held.",
    tip: "You can add as many accounts as you need — one for each broker or bank you use.",
  },
  {
    icon: BriefcaseIcon,
    title: "Add Your Assets",
    description:
      "Within each account, add the assets you hold — stocks, ETFs, bonds, and more. This gives you a complete picture of what you own across all accounts.",
    tip: "Search by ticker symbol or name to quickly find and add your holdings.",
  },
  {
    icon: ArrowsRightLeftIcon,
    title: "Record Transactions",
    description:
      "Log your buy, sell, and dividend transactions to accurately track your cost basis and performance over time.",
    tip: "Recording transactions helps calculate your realized and unrealized gains automatically.",
  },
  {
    icon: ChartBarIcon,
    title: "View Your Dashboard",
    description:
      "Your dashboard shows your total portfolio value, gains and losses, and asset breakdowns — all updated in real time.",
    tip: "Come back to your dashboard anytime to see how your investments are performing.",
  },
];

export function QuickStartGuide({ open, onDismiss }: QuickStartGuideProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function handleNext() {
    if (isLast) {
      onDismiss();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <Dialog open={open} onClose={onDismiss} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-300 to-primary-400 px-6 py-8 text-center">
              <TortoLogo variant="light" className="mx-auto w-28" />
              <p className="mt-3 text-sm font-medium text-white/90">Welcome to Torto</p>
            </div>

            {/* Progress bar */}
            <div className="flex gap-1.5 px-6 pt-5">
              {STEPS.map((_, i) => (
                <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-primary-300 transition-all duration-300"
                    style={{ width: i <= step ? "100%" : "0%" }}
                  />
                </div>
              ))}
            </div>

            {/* Step content */}
            <div className="px-6 pt-5 pb-2">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50">
                  <current.icon className="size-5 text-primary-300" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Step {step + 1} of {STEPS.length}
                  </p>
                  <h3 className="text-base font-semibold text-gray-900">{current.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{current.description}</p>
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary-50 p-3">
                <LightBulbIcon className="mt-0.5 size-4 shrink-0 text-primary-300" />
                <p className="text-xs leading-relaxed text-primary-400">{current.tip}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 pt-4 pb-6">
              <button type="button" onClick={onDismiss} className="text-sm text-gray-400 hover:text-gray-600">
                Skip guide
              </button>
              <div className="flex gap-2">
                {step > 0 && (
                  <OutlinedButton type="button" onClick={handleBack} className="w-auto">
                    Back
                  </OutlinedButton>
                )}
                <FilledButton type="button" onClick={handleNext} className="w-auto">
                  {isLast ? "Get started" : "Next"}
                </FilledButton>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
