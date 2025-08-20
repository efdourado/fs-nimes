'use client'; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Bem-vindo ao Dashboard!</h1>
      <p className="mt-2 text-muted-foreground">
        Seu progresso de estudos será exibido aqui. Continue focado!
      </p>
      
      <Button asChild className="mt-6">
        <Link href="/study-blocks">
          Ver Blocos de Estudo
        </Link>
      </Button>
    </div>
); }