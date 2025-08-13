import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type Question = {
  id: string;
  type: 'CERTO_ERRADO' | 'MULTIPLA_ESCOLHA';
  options?: { options: string[] };
};

interface QuestionOptionsProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerChange: (answer: string) => void;
  isAnswered: boolean;
}

export function QuestionOptions({ question, selectedAnswer, onAnswerChange, isAnswered }: QuestionOptionsProps) {
  const renderMultipleChoice = () => (
    question.options?.options.map((option) => (
      <div key={option} className="flex items-center space-x-3">
        <RadioGroupItem value={option} id={option} />
        <Label htmlFor={option} className="text-base font-normal cursor-pointer">
          {option}
        </Label>
      </div>
  )) );

  const renderTrueFalse = () => (
    <>
      <div className="flex items-center space-x-3">
        <RadioGroupItem value="true" id="certo" />
        <Label htmlFor="certo" className="text-base font-normal cursor-pointer">Certo</Label>
      </div>
      <div className="flex items-center space-x-3">
        <RadioGroupItem value="false" id="errado" />
        <Label htmlFor="errado" className="text-base font-normal cursor-pointer">Errado</Label>
      </div>
    </>
  );

  return (
    <RadioGroup
      onValueChange={onAnswerChange}
      value={selectedAnswer || ''}
      disabled={isAnswered}
      className="space-y-4"
    >
      {question.type === 'MULTIPLA_ESCOLHA' ? renderMultipleChoice() : renderTrueFalse()}
    </RadioGroup>
); }