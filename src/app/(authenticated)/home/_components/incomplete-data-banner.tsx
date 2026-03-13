"use client";

import { useState, useMemo } from "react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useListPositions } from "@/features/position/presentation/hooks/use-list-positions";
import { PositionEntity } from "@/features/position/domain/entities/position";
import { EditAssetModal, EditAssetData } from "@/core/presentations/components/edit-asset-modal";

function isRedeemableType(pos: PositionEntity): boolean {
  return pos.assetTypeCategory === "FIXED_INCOME" ||
    (pos.assetTypeCategory === "CASH" && pos.assetTypeCode === "TIME_DEPOSIT");
}

function isIncompleteFixedIncome(pos: PositionEntity): boolean {
  if (!isRedeemableType(pos)) return false;
  return pos.assetMaturityDate == null || pos.assetFaceValue == null;
}

export function IncompleteDataBanner() {
  const { positions, loading } = useListPositions({ page: 1, limit: 50 });
  const [dismissed, setDismissed] = useState(false);
  const [editAssetData, setEditAssetData] = useState<EditAssetData | null>(null);

  const incompletePositions = useMemo(() => {
    if (!positions) return [];
    // Deduplicate by assetId since multiple positions may share the same asset
    const seen = new Set<string>();
    return positions.filter((pos) => {
      if (!isIncompleteFixedIncome(pos)) return false;
      if (seen.has(pos.assetId)) return false;
      seen.add(pos.assetId);
      return true;
    });
  }, [positions]);

  if (loading || dismissed || incompletePositions.length === 0) return null;

  return (
    <>
      <div className="rounded-lg border border-warning-300/30 bg-warning-50 px-4 py-3">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="mt-0.5 size-5 shrink-0 text-warning-300" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {incompletePositions.length === 1
                ? "1 fixed-income asset is missing maturity data"
                : `${incompletePositions.length} fixed-income assets are missing maturity data`}
            </p>
            <p className="mt-0.5 text-sm text-gray-600">
              Add maturity date and face value to enable redemption tracking.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {incompletePositions.map((pos) => (
                <button
                  key={pos.assetId}
                  type="button"
                  onClick={() =>
                    setEditAssetData({
                      assetId: pos.assetId,
                      name: pos.assetName ?? "",
                      ticker: pos.assetTicker,
                      assetTypeCode: pos.assetTypeCode,
                      assetTypeCategory: pos.assetTypeCategory,
                      maturityDate: pos.assetMaturityDate,
                      faceValue: pos.assetFaceValue,
                    })
                  }
                  className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
                >
                  {pos.assetName ?? pos.assetTicker ?? "Unknown"} — Edit
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="shrink-0 rounded-md p-0.5 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <XMarkIcon className="size-4" />
          </button>
        </div>
      </div>

      {editAssetData && (
        <EditAssetModal
          open={!!editAssetData}
          onClose={() => setEditAssetData(null)}
          asset={editAssetData}
        />
      )}
    </>
  );
}
