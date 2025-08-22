'use client';

import { useRouter } from 'next/navigation';
import { Lock, CheckCircle, Play } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export type BlockData = {
  id: string;
  title: string;
  description: string | null;
  totalQuestions: number;
  userStatus: {
    unlocked: boolean;
    completed: boolean;
    correctAnswers: number;
    wrongAnswers: number;
}; };

interface StudyBlockCardProps {
  block: BlockData;
}

export function StudyBlockCard({ block }: StudyBlockCardProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const { unlocked, completed, correctAnswers } = block.userStatus;
  const progressPercentage =
    block.totalQuestions > 0
      ? ((correctAnswers) / block.totalQuestions) * 100
      : 0;

  const handleStart = async () => {
    if (!unlocked || isStarting) return;

    setIsStarting(true);
    const token = localStorage.getItem('accessToken');
    try {
      await api.post(`/study-blocks/${block.id}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push(`/study-blocks/${block.id}`);
    } catch (error) {
      console.error('Falha ao iniciar bloco', error);
      alert('Não foi possível iniciar o bloco de estudos.');
      setIsStarting(false);
  } };

  return (
    <div
      onClick={handleStart}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-md transition-all duration-300',
        !unlocked
          ? 'opacity-60 cursor-not-allowed bg-muted/50'
          : 'cursor-pointer hover:border-primary/80 hover:shadow-lg hover:-translate-y-1'
      )}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold pr-8">{block.title}</h2>
          <div className="flex-shrink-0">
            {completed ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : !unlocked ? (
              <Lock className="h-6 w-6 text-muted-foreground" />
            ) : (
              <Play className="h-6 w-6 text-muted-foreground transition-transform group-hover:scale-125 group-hover:text-primary" />
            )}
          </div>
        </div>
        <p className="text-muted-foreground mt-2 min-h-[40px] text-sm">{block.description}</p>
      </div>
      {unlocked && (
        <div className="px-6 pb-4 mt-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progresso</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
); }