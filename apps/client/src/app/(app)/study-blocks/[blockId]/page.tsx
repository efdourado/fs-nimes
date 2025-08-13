'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Question = {
  id: string;
  statement: string;
  type: 'CERTO_ERRADO' | 'MULTIPLA_ESCOLHA';
  options?: { options: string[]; answer: string };
};
type Feedback = {
  correct: boolean;
  explanation: string;
};

export default function StudySessionPage() {
  const params = useParams();
  const router = useRouter();
  const blockId = params.blockId as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!blockId) return;
    const fetchQuestions = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      try {
        const { data } = await api.get(`/questions/block/${blockId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(data);
      } catch (error) {
        console.error('Falha ao buscar questões', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [blockId]);

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    const token = localStorage.getItem('accessToken');
    const currentQuestion = questions[currentQuestionIndex];
    try {
      const { data } = await api.post(
        `/questions/${currentQuestion.id}/answer`,
        { answer: selectedAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback(data);
    } catch (error) {
      console.error('Falha ao submeter resposta', error);
      alert('Erro ao enviar resposta.');
  } };

  const handleNextQuestion = () => {
    setFeedback(null);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('Você concluiu este bloco!');
      router.push('/study-blocks');
  } };

  if (isLoading) return <p>Carregando questões...</p>;
  if (questions.length === 0) return <p>Nenhuma questão encontrada para este bloco.</p>;

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = feedback !== null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Questão {currentQuestionIndex + 1} de {questions.length}</h1>
      <p className="text-lg mb-6">{currentQuestion.statement}</p>

      <div className="space-y-4">
        {currentQuestion.type === 'MULTIPLA_ESCOLHA' && currentQuestion.options && (
          <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer || ''} disabled={isAnswered}>
            {currentQuestion.options.options.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {currentQuestion.type === 'CERTO_ERRADO' && (
          <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer || ''} disabled={isAnswered}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="certo" />
              <Label htmlFor="certo">Certo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="errado" />
              <Label htmlFor="errado">Errado</Label>
            </div>
          </RadioGroup>
        )}
      </div>

      {isAnswered && (
        <div className={cn(
          "mt-6 p-4 rounded-md flex gap-4",
          feedback.correct ? 'bg-green-100 dark:bg-green-900 border border-green-300' : 'bg-red-100 dark:bg-red-900 border border-red-300'
        )}>
          {feedback.correct ? <Check className="text-green-500 w-6 h-6"/> : <X className="text-red-500 w-6 h-6"/>}
          <div>
            <h3 className="font-bold">{feedback.correct ? 'Resposta Correta!' : 'Resposta Incorreta'}</h3>
            <p className="text-sm mt-1">{feedback.explanation}</p>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        {!isAnswered ? (
          <Button onClick={handleSubmit} disabled={!selectedAnswer}>Responder</Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Bloco'}
          </Button>
        )}
      </div>
    </div>
); }