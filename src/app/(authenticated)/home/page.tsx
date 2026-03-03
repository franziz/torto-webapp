import { SectionCard } from "@/core/presentations/components/section-card";
import { PageHeading } from "@/core/presentations/components/page-heading";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageHeading>Welcome Home</PageHeading>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Getting Started">
          <p className="text-sm text-gray-600">
            This is your dashboard. Start building your application by modifying the features in{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">src/features/</code>.
          </p>
        </SectionCard>
        <SectionCard title="Sample Feature">
          <p className="text-sm text-gray-600">
            Check out the <a href="/items" className="text-primary-300 hover:underline">Items</a> page to see a
            complete Clean Architecture example with data fetching.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
