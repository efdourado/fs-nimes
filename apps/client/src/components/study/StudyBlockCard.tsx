'use client';

import Link from 'next/link';
import { Lock, CheckCircle } from 'lucide-react';

export type BlockData = {
  id: string;
  title: string;
  description: string | null;
  totalQuestions: number;
  userStatus: {
    unlocked: boolean;
    completed: boolean;
    correctAnswers: number;
}; };

interface StudyBlockCardProps {
  block: BlockData;
}

export function StudyBlockCard({ block }: StudyBlockCardProps) {
  const { unlocked, completed, correctAnswers } = block.userStatus;
  const progressPercentage = block.totalQuestions > 0 ? (correctAnswers / block.totalQuestions) * 100 : 0;

  const cardContent = (
    <>
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold">{block.title}</h2>
        {completed ? (
          <CheckCircle className="h-6 w-6 text-green-500" />
        ) : !unlocked ? (
          <Lock className="h-6 w-6 text-muted-foreground" />
        ) : null}
      </div>
      <p className="text-muted-foreground mt-2 min-h-[40px]">{block.description}</p>
      {unlocked && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Progresso</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </>
  );

  if (!unlocked) {
    return (
      <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm opacity-50 cursor-not-allowed">
        {cardContent}
      </div>
  ); }

  return (
    <Link href={`/study-blocks/${block.id}`} legacyBehavior>
      <a className="block p-6 rounded-lg border bg-card text-card-foreground shadow-sm transition-transform hover:-translate-y-1">
        {cardContent}
      </a>
    </Link>
); }