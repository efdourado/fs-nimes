'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { QuestionForm } from '@/components/admin/QuestionForm';
import type { BlockData } from '@/components/study/StudyBlockCard';

export default function NewQuestionPage() {
  const router = useRouter();
  const [blocks, setBlocks] = useState<Pick<BlockData, 'id' | 'title'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      try {
        const { data } = await api.get('/study-blocks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlocks(data.map((b: BlockData) => ({ id: b.id, title: b.title })));
      } catch (err) {
        console.error('Falha ao buscar blocos', err);
        setError('Não foi possível carregar os blocos de estudo.');
      } finally {
        setIsLoading(false);
    } };
    fetchBlocks();
  }, []);

  const handleSave = async (data: any) => {
    const token = localStorage.getItem('accessToken');
    try {
      await api.post('/questions', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Questão criada com sucesso!');
      router.push('/study-blocks');
    } catch (err) {
      console.error('Falha ao criar questão', err);
      alert('Erro ao criar a questão. Verifique o console.');
  } };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p className="text-destructive">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Adicionar Nova Questão</h2>
      <QuestionForm blocks={blocks} onSave={handleSave} />
    </div>
); }