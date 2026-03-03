"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "torto:quickstart:dismissed";

export function useQuickStartGuide() {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed !== "true") {
        setShowGuide(true);
      }
    } catch {
      // localStorage unavailable (private browsing, etc.)
    }
  }, []);

  const dismissGuide = useCallback(() => {
    setShowGuide(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // localStorage unavailable
    }
  }, []);

  return { showGuide, dismissGuide };
}
