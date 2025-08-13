import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-900 text-white">
      <div className="absolute inset-0 bg-grid-slate-700/[0.6] [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
      
      <div className="container relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
          Domine o Direito Previdenciário
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400 sm:text-xl">
          Uma plataforma de estudos gamificada, com milhares de questões, simulados e um sistema de progressão inteligente para acelerar sua aprovação.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/auth">Começar a Estudar (Grátis)</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 hover:text-slate-100">
            <Link href="/auth">Já tenho uma conta</Link>
          </Button>
        </div>
      </div>
    </div>
); }