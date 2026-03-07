export default function HomeLayout({
  mobileView,
  desktopView,
}: {
  mobileView: React.ReactNode;
  desktopView: React.ReactNode;
}) {
  return (
    <>
      <div className="md:hidden">{mobileView}</div>
      <div className="hidden md:block">{desktopView}</div>
    </>
  );
}
