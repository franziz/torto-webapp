"use client";

import { useIsMobile } from "@/core/presentations/hooks/use-is-mobile";

export default function HomeLayout({
  mobileView,
  desktopView,
}: {
  mobileView: React.ReactNode;
  desktopView: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  return isMobile ? mobileView : desktopView;
}
