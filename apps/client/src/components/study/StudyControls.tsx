import { Button } from '@/components/ui/button';

interface StudyControlsProps {
  isAnswered: boolean;
  isSubmitting: boolean;
  isAnswerSelected: boolean;
  isLastQuestion: boolean;
  onSubmit: () => void;
  onNext: () => void;
}

export function StudyControls({
  isAnswered,
  isSubmitting,
  isAnswerSelected,
  isLastQuestion,
  onSubmit,
  onNext,
}: StudyControlsProps) {
  return (
    <div className="mt-8 flex justify-end">
      {!isAnswered ? (
        <Button onClick={onSubmit} disabled={!isAnswerSelected || isSubmitting}>
          {isSubmitting ? 'Respondendo...' : 'Responder'}
        </Button>
      ) : (
        <Button onClick={onNext}>
          {isLastQuestion ? 'Finalizar Bloco' : 'Próxima Questão'}
        </Button>
      )}
    </div>
); }