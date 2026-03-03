import { SignInForm } from "@/app/(authentication)/sign-in/_components/sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
