"use client";

import { useId } from "react";
import clsx from "clsx";

type TortoLogoProps = {
  className?: string;
  variant?: "dark" | "light";
};

export function TortoLogo({ className, variant = "dark" }: TortoLogoProps) {
  const maskId = useId();
  const mainFill = variant === "dark" ? "#0F766E" : "#FFFFFF";

  return (
    <svg
      className={clsx("h-auto", className)}
      viewBox="0 0 640 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Torto"
    >
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle cx="547" cy="150" r="20" fill="black" />
          <g fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 527 85 Q 562 150 527 215" />
            <path d="M 567 125 L 552 150 L 567 175" />
            <path d="M 567 125 L 577 150 L 567 175" />
            <path d="M 567 125 L 612 100" />
            <path d="M 567 175 L 612 200" />
            <path d="M 577 150 L 617 150" />
          </g>
        </mask>
      </defs>

      <g fill={mainFill}>
        {/* T */}
        <path d="M 40 60 L 160 60 L 160 92 L 116 92 L 116 200 L 84 200 L 84 92 L 40 92 Z" />
        {/* o */}
        <path
          d="M 210 98 A 52 52 0 1 0 210 202 A 52 52 0 1 0 210 98 Z M 210 130 A 20 20 0 1 1 210 170 A 20 20 0 1 1 210 130 Z"
          fillRule="evenodd"
        />
        {/* r */}
        <path d="M 300 100 L 332 100 L 332 120 C 345 98, 365 95, 385 105 L 373 135 C 360 128, 345 130, 332 150 L 332 200 L 300 200 Z" />
        {/* t */}
        <path d="M 420 70 L 452 70 L 452 100 L 475 100 L 475 128 L 452 128 L 452 165 C 452 175, 460 180, 475 180 L 475 202 C 435 202, 420 185, 420 155 L 420 128 L 405 128 L 405 100 L 420 100 Z" />
        {/* Shell o */}
        <circle cx="557" cy="150" r="52" mask={`url(#${maskId})`} />
      </g>
    </svg>
  );
}
