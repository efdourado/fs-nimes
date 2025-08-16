'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { QuestionForm } from '@/components/admin/QuestionForm';
import type { BlockData } from '@/components/study/StudyBlockCard';

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.questionId as string;
  
  const [question, setQuestion] = useState(null);
  const [blocks, setBlocks] = useState<Pick<BlockData, 'id' | 'title'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!questionId) return;
    
    setIsLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
      const [questionRes, blocksRes] = await Promise.all([
        api.get(`/questions/${questionId}`, { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/study-blocks', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const formattedQuestion = {
        ...questionRes.data,

        options: questionRes.data.options ? {
          answer: questionRes.data.options.answer,
          options: questionRes.data.options.options.map((opt: string) => ({ value: opt }))
        } : undefined
      };

      setQuestion(formattedQuestion);
      setBlocks(blocksRes.data.map((b: BlockData) => ({ id: b.id, title: b.title })));

    } catch (err) {
      console.error('Falha ao buscar dados para edição', err);
      setError('Não foi possível carregar os dados da questão.');
    } finally {
      setIsLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (data: any) => {
    const token = localStorage.getItem('accessToken');
    
    const payload = {
      ...data,
      options: data.options ? {
        answer: data.options.answer,
        options: data.options.options.map((opt: { value: string }) => opt.value)
      } : undefined
    };

    try {
      await api.put(`/questions/${questionId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Questão atualizada com sucesso!');
      router.push('/admin/questions');
    } catch (err) {
      console.error('Falha ao atualizar questão', err);
      alert('Erro ao atualizar a questão. Verifique o console.');
  } };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p className="text-destructive">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Editar Questão</h2>
      {question && <QuestionForm blocks={blocks} onSave={handleSave} initialData={question} />}
    </div>
); }