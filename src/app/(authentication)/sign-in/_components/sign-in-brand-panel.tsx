import { TortoLogo } from "@/core/presentations/components/torto-logo";

export function SignInBrandPanel() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-r-3xl bg-gradient-to-br from-primary-500 via-primary-400 to-primary-300 p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-white/20" />
      <div className="pointer-events-none absolute right-1/3 top-1/2 size-40 rounded-full bg-white/10" />

      <div className="relative z-10">
        <TortoLogo variant="light" className="w-32" />
      </div>

      <blockquote className="relative z-10 space-y-4">
        <p className="text-lg leading-relaxed text-white/90">
          &ldquo;Torto has transformed how we manage our portfolio. The clarity and control it provides are
          unmatched.&rdquo;
        </p>
        <footer className="text-sm font-medium text-white/70">&mdash; Sarah Chen, Director of Wealth Advisory</footer>
      </blockquote>
    </div>
  );
}
