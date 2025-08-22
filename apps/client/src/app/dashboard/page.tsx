'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { ArrowRight } from 'lucide-react';

interface UserStats {
  accuracy: number;
  completedBlocks: number;
  totalBlocks: number;
  lastStudiedBlock: {
    id: string;
    title: string;
  } | null;
}

const StatCard = ({ title, value, footer }: { title: string; value: string | number; footer?: string }) => (
  <div className="rounded-xl border bg-card text-card-foreground p-6 shadow">
    <div className="text-sm font-medium text-muted-foreground">{title}</div>
    <div className="mt-2 text-3xl font-bold">{value}</div>
    {footer && <p className="text-xs text-muted-foreground mt-1">{footer}</p>}
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const { data } = await api.get('/users/me/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data);
      } catch (error) {
        console.error('Falha ao buscar estatísticas', error);
      } finally {
        setIsLoading(false);
    } };
    
    fetchStats();
  }, []);

  if (isLoading) {
    return <p>Carregando seu progresso...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Seu Desempenho</h1>
      <p className="mt-2 text-muted-foreground">
        Continue focado para alcançar seus objetivos.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Aproveitamento Geral" value={`${stats?.accuracy || 0}%`} footer="Acertos vs. Erros" />
        <StatCard title="Blocos Concluídos" value={`${stats?.completedBlocks || 0} de ${stats?.totalBlocks || 0}`} footer="Progresso total" />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Acesso Rápido</h2>
        {stats?.lastStudiedBlock ? (
          <Button asChild className="mt-4">
            <Link href={`/study-blocks/${stats.lastStudiedBlock.id}`}>
              Continuar: {stats.lastStudiedBlock.title} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild className="mt-4">
            <Link href="/study-blocks">
              Começar a estudar
            </Link>
          </Button>
        )}
      </div>
    </div>
); }