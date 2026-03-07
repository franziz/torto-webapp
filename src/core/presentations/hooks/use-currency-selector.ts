"use client";

import { useState, useMemo } from "react";
import { useGetPortfolioSummary } from "@/features/portfolio/presentation/hooks/use-get-portfolio-summary";
import { useListCurrencies } from "@/features/currency/presentation/hooks/use-list-currencies";
import { ALL_TAB } from "@/core/presentations/components/currency-tabs";

export function useCurrencySelector() {
  const { data: summaryData, loading: summaryLoading, error: summaryError } = useGetPortfolioSummary();
  const { currencies } = useListCurrencies();

  const displayCurrencyOptions = useMemo(() => {
    if (!currencies) return [];
    return currencies.map((c) => c.code);
  }, [currencies]);

  const nativeCurrencies = useMemo(() => {
    if (!summaryData) return [];
    return [...new Set(summaryData.map((s) => s.currency))];
  }, [summaryData]);

  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<string | null>(null);

  const isAllMode = selectedCurrency === ALL_TAB;

  const activeCurrency = isAllMode
    ? ALL_TAB
    : selectedCurrency && nativeCurrencies.includes(selectedCurrency)
      ? selectedCurrency
      : nativeCurrencies[0];

  const activeDisplayCurrency =
    displayCurrency && displayCurrencyOptions.includes(displayCurrency) ? displayCurrency : nativeCurrencies[0];

  return {
    summaryData,
    summaryLoading,
    summaryError,
    nativeCurrencies,
    displayCurrencyOptions,
    setSelectedCurrency,
    setDisplayCurrency,
    isAllMode,
    activeCurrency,
    activeDisplayCurrency,
    showDisplaySelector: isAllMode,
  };
}
