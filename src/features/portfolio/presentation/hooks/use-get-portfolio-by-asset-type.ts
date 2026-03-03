"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PortfolioRepositoryImpl } from "@/features/portfolio/data/repositories/portfolio";
import { PortfolioServiceImpl } from "@/features/portfolio/data/sources/portfolio";
import { HttpRequest } from "@/core/helpers/http-request";
import { GetPortfolioByAssetTypeUseCase } from "@/features/portfolio/domain/usecases/get-portfolio-by-asset-type.usecases";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PortfolioByAssetTypeEntity } from "@/features/portfolio/domain/entities/portfolio-by-asset-type";

// TODO: Remove when backend deploys currency grouping for /api/portfolio/by-asset-type
const USE_HARDCODED_ASSET_TYPE_DATA = true;

const HARDCODED_DATA: PortfolioByAssetTypeEntity[] = [
  new PortfolioByAssetTypeEntity({
    assetTypeId: "hardcoded-stock-idr",
    assetTypeCode: "STOCK",
    assetTypeName: "Saham",
    currency: "IDR",
    totalCost: 150_000_000,
    currentValue: 165_000_000,
    unrealizedGain: 15_000_000,
    realizedGain: 2_500_000,
  }),
  new PortfolioByAssetTypeEntity({
    assetTypeId: "hardcoded-stock-sgd",
    assetTypeCode: "STOCK",
    assetTypeName: "Saham",
    currency: "SGD",
    totalCost: 5_000,
    currentValue: 5_500,
    unrealizedGain: 500,
    realizedGain: 0,
  }),
  new PortfolioByAssetTypeEntity({
    assetTypeId: "hardcoded-bond-idr",
    assetTypeCode: "BOND",
    assetTypeName: "Obligasi",
    currency: "IDR",
    totalCost: 50_000_000,
    currentValue: 52_000_000,
    unrealizedGain: 2_000_000,
    realizedGain: 1_000_000,
  }),
  new PortfolioByAssetTypeEntity({
    assetTypeId: "hardcoded-mutual-fund-idr",
    assetTypeCode: "MUTUAL_FUND",
    assetTypeName: "Reksa Dana",
    currency: "IDR",
    totalCost: 25_000_000,
    currentValue: 27_500_000,
    unrealizedGain: 2_500_000,
    realizedGain: 0,
  }),
];

type UseGetPortfolioByAssetTypeReturnType =
  | { data: null; loading: true; error: null }
  | { data: PortfolioByAssetTypeEntity[]; loading: false; error: null }
  | { data: null; loading: false; error: ServerError };

async function PortfolioByAssetTypeFetcher([_, clerk]: [string, ReturnType<typeof useClerk>]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk }));
  const portfolioRepository = new PortfolioRepositoryImpl(new PortfolioServiceImpl(new HttpRequest()));

  const useCase = new GetPortfolioByAssetTypeUseCase(portfolioRepository, sessionRepository);
  const result = await useCase.execute();
  if (result instanceof DataFailed) throw result.error;

  return result.data!;
}

export function useGetPortfolioByAssetType(): UseGetPortfolioByAssetTypeReturnType {
  const clerk = useClerk();
  const swrKey = USE_HARDCODED_ASSET_TYPE_DATA ? null : (["portfolio-by-asset-type", clerk] as [string, typeof clerk]);
  const { data, isLoading, error } = useSWR(swrKey, PortfolioByAssetTypeFetcher);

  // TODO: Remove when backend deploys currency grouping
  if (USE_HARDCODED_ASSET_TYPE_DATA) {
    return { data: HARDCODED_DATA, loading: false, error: null };
  }

  if (isLoading) return { data: null, loading: true, error: null };

  if (error) {
    return {
      data: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
    };
  }

  if (!data) return { data: null, loading: true, error: null };

  return { data, loading: false, error: null };
}
