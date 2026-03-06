import { PageHeading } from "@/core/presentations/components/page-heading";
import { SettingsContent } from "@/app/(authenticated)/settings/_components/settings-content";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeading>Settings</PageHeading>
      <SettingsContent />
    </div>
  );
}
