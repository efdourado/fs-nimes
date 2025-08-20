import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-slate-100/5 to-background dark:via-slate-900/10" />
      <div className="absolute inset-0 z-10 bg-[url('/grid.svg')] [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)] dark:invert" />

      <div className="container relative z-20 flex flex-col items-center text-center px-4">
        <h1 className="text-4xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          Domine o Direito Previdenciário
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Uma plataforma de estudos gamificada, com um sistema de progressão inteligente para acelerar sua aprovação. Comece a aprender de graça, agora mesmo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/auth">Começar a Estudar (Grátis)</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/auth">Já tenho uma conta</Link>
          </Button>
        </div>
      </div>
    </div>
); }