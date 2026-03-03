"use client";

import { useQuickStartGuide } from "@/core/presentations/hooks/use-quick-start-guide";
import { QuickStartGuide } from "@/app/(authenticated)/home/_components/quick-start-guide";

export function QuickStartGuideImpl() {
  const { showGuide, dismissGuide } = useQuickStartGuide();

  return <QuickStartGuide open={showGuide} onDismiss={dismissGuide} />;
}
