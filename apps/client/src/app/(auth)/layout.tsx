export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4">
      <div className="absolute inset-0 bg-black/60" />

      {children}
    </div>
); }