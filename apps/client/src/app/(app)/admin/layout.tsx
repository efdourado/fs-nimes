export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>
      <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
        {children}
      </div>
    </div>
); }