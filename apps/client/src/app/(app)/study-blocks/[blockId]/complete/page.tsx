'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { StudyCompletionCard } from '@/components/study/StudyCompletionCard';
import type { BlockData } from '@/components/study/StudyBlockCard';

export default function StudyCompletionPage() {
  const params = useParams();
  const blockId = params.blockId as string;

  const [blockData, setBlockData] = useState<BlockData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!blockId) return;

    const fetchBlockData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      try {
        const { data } = await api.get('/study-blocks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const completedBlock = data.find((b: BlockData) => b.id === blockId);
        setBlockData(completedBlock);
      } catch (error) {
        console.error('Falha ao buscar dados do bloco', error);
      } finally {
        setIsLoading(false);
    } };

    fetchBlockData();
  }, [blockId]);

  if (isLoading) {
    return <p>Calculando seus resultados...</p>;
  }

  if (!blockData) {
    return <p>Não foi possível carregar os resultados do bloco.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[calc(100vh-200px)]">
      <StudyCompletionCard blockData={blockData} />
    </div>
); }