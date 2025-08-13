export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4">
      {/* Efeito de sobreposição escuro para dar profundidade */}
      <div className="absolute inset-0 bg-black/60" />

      {/* O {children} aqui será a nossa página /auth com a animação.
        As classes do container garantem que ele fique perfeitamente centralizado.
      */}
      {children}
    </div>
  );
}