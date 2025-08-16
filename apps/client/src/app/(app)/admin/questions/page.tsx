'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

type QuestionWithBlock = {
  id: string;
  statement: string;
  type: string;
  difficulty: string;
  block: {
    title: string;
}; };

export default function QuestionsListPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionWithBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
      const { data } = await api.get('/questions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(data);
    } catch (error) {
      console.error('Falha ao buscar questões', error);
    } finally {
      setIsLoading(false);
  } };
  
  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (questionId: string) => {
    if (!window.confirm('Tem certeza que deseja remover esta questão?')) return;

    const token = localStorage.getItem('accessToken');
    try {
      await api.delete(`/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Questão removida com sucesso.');
      fetchQuestions();
    } catch (error) {
      console.error('Falha ao remover questão', error);
      alert('Erro ao remover a questão.');
  } };

  if (isLoading) return <p>Carregando questões...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gerenciar Questões</h2>
        <Button asChild>
          <Link href="/admin/questions/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Questão
          </Link>
        </Button>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-[1fr_150px_100px_100px] gap-4 p-4 font-bold border-b bg-slate-50 dark:bg-slate-800">
          <p>Enunciado</p>
          <p>Bloco</p>
          <p>Tipo</p>
          <p>Ações</p>
        </div>
        {questions.length > 0 ? (
          questions.map((q) => (
            <div
              key={q.id}
              className="grid grid-cols-[1fr_150px_100px_100px] gap-4 p-4 border-b last:border-b-0 items-center"
            >
              <p className="truncate">{q.statement}</p>
              <p className="text-sm text-muted-foreground">{q.block.title}</p>
              <p className="text-sm text-muted-foreground">{q.type}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => router.push(`/admin/questions/${q.id}/edit`)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(q.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-muted-foreground">Nenhuma questão encontrada.</p>
        )}
      </div>
    </div>
); }