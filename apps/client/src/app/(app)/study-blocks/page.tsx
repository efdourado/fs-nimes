'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BlockData, StudyBlockCard } from '@/components/study/StudyBlockCard';

export default function StudyBlocksPage() {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const { data } = await api.get('/study-blocks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlocks(data);
      } catch (error) {
        console.error('Falha ao buscar blocos de estudo', error);
      } finally {
        setIsLoading(false);
    } };
    
    fetchBlocks();
  }, []);

  if (isLoading) {
    return <p>Carregando blocos de estudo...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Blocos de Estudo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blocks.map((block) => (
          <StudyBlockCard key={block.id} block={block} />
        ))}
      </div>
    </div>
); }