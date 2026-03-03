export function PageHeading({ children }: { children: React.ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">{children}</h1>
    </header>
  );
}
