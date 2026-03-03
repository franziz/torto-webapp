type PageHeadingProps = {
  children: React.ReactNode;
  subtitle?: string;
};

export function PageHeading({ children, subtitle }: PageHeadingProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">{children}</h1>
      {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
    </header>
  );
}
