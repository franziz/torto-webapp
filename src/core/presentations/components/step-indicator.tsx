"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

type StepIndicatorProps = {
  steps: string[];
  currentIndex: number;
};

export function StepIndicator(props: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center gap-0">
        {props.steps.map((step, index) => {
          const isCompleted = index < props.currentIndex;
          const isCurrent = index === props.currentIndex;

          return (
            <li key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                    isCompleted && "bg-primary-300 text-white",
                    isCurrent && "border-2 border-primary-300 bg-white text-primary-300",
                    !isCompleted && !isCurrent && "border-2 border-gray-300 bg-white text-gray-400",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? <CheckIcon className="size-5" /> : index + 1}
                </div>
                <span
                  className={clsx(
                    "mt-1.5 text-xs font-medium",
                    isCompleted && "text-primary-300",
                    isCurrent && "text-primary-300",
                    !isCompleted && !isCurrent && "text-gray-400",
                  )}
                >
                  {step}
                </span>
              </div>
              {index < props.steps.length - 1 && (
                <div
                  className={clsx(
                    "mx-1 mb-5 h-0.5 w-6 sm:mx-2 sm:w-12",
                    index < props.currentIndex ? "bg-primary-300" : "bg-gray-300",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
