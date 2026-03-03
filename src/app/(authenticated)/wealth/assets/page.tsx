import { PageHeading } from "@/core/presentations/components/page-heading";
import { AssetListImpl } from "@/app/(authenticated)/wealth/assets/_components/asset-list-impl";

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <PageHeading>Assets</PageHeading>
      <AssetListImpl />
    </div>
  );
}
