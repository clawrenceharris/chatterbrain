export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="items-center justify-center py-9">{children}</main>;
}
