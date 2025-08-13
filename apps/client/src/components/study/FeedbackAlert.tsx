import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackAlertProps {
  feedback: {
    correct: boolean;
    explanation: string;
  } | null;
}

export function FeedbackAlert({ feedback }: FeedbackAlertProps) {
  if (!feedback) return null;

  const { correct, explanation } = feedback;

  return (
    <div
      className={cn(
        'mt-6 p-4 rounded-md flex gap-4 border',
        correct
          ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
          : 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
      )}
    >
      {correct ? (
        <Check className="text-green-500 w-6 h-6 flex-shrink-0" />
      ) : (
        <X className="text-red-500 w-6 h-6 flex-shrink-0" />
      )}
      <div>
        <h3 className={cn(
          'font-bold text-lg',
          correct ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
        )}>
          {correct ? 'Resposta Correta!' : 'Resposta Incorreta'}
        </h3>
        <p className="text-sm mt-1 text-muted-foreground">{explanation}</p>
      </div>
    </div>
); }