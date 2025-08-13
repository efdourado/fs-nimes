import Link from 'next/link';
import { CheckCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlockData } from './StudyBlockCard';

interface StudyCompletionCardProps {
  blockData: BlockData;
}

export function StudyCompletionCard({ blockData }: StudyCompletionCardProps) {
  const { title, totalQuestions } = blockData;
  const { correctAnswers, wrongAnswers } = blockData.userStatus;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const isApproved = accuracy >= 70;

  return (
    <div className="w-full p-8 rounded-xl border bg-card text-card-foreground shadow-lg text-center">
      <Award className="mx-auto h-16 w-16 text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">Bloco Concluído!</h1>
      <p className="text-muted-foreground mb-6">Você finalizou o bloco "{title}".</p>

      <div className="grid grid-cols-2 gap-4 my-8 text-left">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h3 className="font-semibold text-muted-foreground">Acertos</h3>
          <p className="text-2xl font-bold text-green-500">{correctAnswers}</p>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h3 className="font-semibold text-muted-foreground">Erros</h3>
          <p className="text-2xl font-bold text-red-500">{wrongAnswers}</p>
        </div>
        <div className="col-span-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h3 className="font-semibold text-muted-foreground">Aproveitamento</h3>
          <p className="text-2xl font-bold text-primary">{accuracy.toFixed(0)}%</p>
        </div>
      </div>

      {isApproved ? (
        <p className="text-green-600 dark:text-green-400 mb-6">
          Parabéns! Você atingiu o critério de aprovação e o próximo bloco foi desbloqueado.
        </p>
      ) : (
        <p className="text-amber-600 dark:text-amber-400 mb-6">
          Você não atingiu os 70% de aproveitamento. Estude mais um pouco e tente novamente!
        </p>
      )}

      <div className="flex justify-center gap-4">
        <Button variant="outline" asChild>
          <Link href={`/study-blocks/${blockData.id}`}>Tentar Novamente</Link>
        </Button>
        <Button asChild>
          <Link href="/study-blocks">Voltar aos Blocos</Link>
        </Button>
      </div>
    </div>
); }