import { ProtectedPage } from "@/app/(authenticated)/_components/protected-page";
import { NavigationBar } from "@/app/(authenticated)/_components/navigation-bar";
import { Header } from "@/app/(authenticated)/_components/header";
import { BottomTabBar } from "@/app/(authenticated)/_components/bottom-tab-bar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <div className="flex h-screen flex-row overflow-hidden">
        <div className="hidden md:flex">
          <NavigationBar />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden bg-white">
          <Header />
          <div className="flex-1 overflow-y-auto p-4 pb-20 md:p-8 md:pb-8">{children}</div>
        </div>
      </div>
      <BottomTabBar />
    </ProtectedPage>
  );
}
