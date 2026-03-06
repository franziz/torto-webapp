import { PageHeading } from "@/core/presentations/components/page-heading";
import { ActivityListImpl } from "@/app/(authenticated)/activity/_components/activity-list-impl";

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <PageHeading>Activity</PageHeading>
      <ActivityListImpl />
    </div>
  );
}
