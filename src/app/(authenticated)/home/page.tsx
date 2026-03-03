import { PageHeading } from "@/core/presentations/components/page-heading";
import { DashboardClient } from "@/app/(authenticated)/home/_components/dashboard-client";
import { PositionsTableImpl } from "@/app/(authenticated)/home/_components/positions-table-impl";
import { QuickStartGuideImpl } from "@/app/(authenticated)/home/_components/quick-start-guide-impl";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageHeading>Dashboard</PageHeading>
      <DashboardClient />
      <PositionsTableImpl />
      <QuickStartGuideImpl />
    </div>
  );
}
