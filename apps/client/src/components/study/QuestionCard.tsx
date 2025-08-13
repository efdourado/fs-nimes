import { QuestionOptions } from './QuestionOptions';

type Question = {
  id: string;
  statement: string;
  type: 'CERTO_ERRADO' | 'MULTIPLA_ESCOLHA';
  options?: { options: string[] };
};

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerChange: (answer: string) => void;
  isAnswered: boolean;
}

export function QuestionCard({ question, selectedAnswer, onAnswerChange, isAnswered }: QuestionCardProps) {
  return (
    <div className="my-6 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <p className="text-lg leading-relaxed mb-6">{question.statement}</p>
      <QuestionOptions
        question={question}
        selectedAnswer={selectedAnswer}
        onAnswerChange={onAnswerChange}
        isAnswered={isAnswered}
      />
    </div>
); }