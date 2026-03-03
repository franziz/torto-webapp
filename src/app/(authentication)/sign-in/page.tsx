import { SignInBrandPanel } from "@/app/(authentication)/sign-in/_components/sign-in-brand-panel";
import { SignInForm } from "@/app/(authentication)/sign-in/_components/sign-in-form";
import { TortoLogo } from "@/core/presentations/components/torto-logo";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex lg:w-2/5">
        <SignInBrandPanel />
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          <TortoLogo className="mb-8 w-28 lg:hidden" />

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-500">
              Welcome back to <span className="text-primary-300">Torto</span>
            </h1>
            <p className="mt-2 text-sm text-neutral-300">
              Enter your credentials to access your wealth management dashboard.
            </p>
          </div>

          <SignInForm />
        </div>
      </div>
    </div>
  );
}
