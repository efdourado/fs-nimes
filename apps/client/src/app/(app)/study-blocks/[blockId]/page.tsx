'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { QuestionCard } from '@/components/study/QuestionCard';
import { StudyHeader } from '@/components/study/StudyHeader';
import { StudyControls } from '@/components/study/StudyControls';
import { FeedbackAlert } from '@/components/study/FeedbackAlert';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestions = useCallback(async () => {
    if (!blockId) return;
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
  }, [blockId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleNextQuestion = useCallback(() => {
    setFeedback(null);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      router.push(`/study-blocks/${blockId}/complete`);
    }
  }, [currentQuestionIndex, questions.length, router, blockId]);

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    setIsSubmitting(true);
    const token = localStorage.getItem('accessToken');
    const currentQuestion = questions[currentQuestionIndex];
    try {
      const { data } = await api.post(
        `/questions/${currentQuestion.id}/answer`,
        { answer: selectedAnswer },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFeedback(data);
    } catch (error: any) {
      if (error.response?.status === 409) {
        setFeedback({ 
          correct: false, 
          explanation: 'Você já respondeu esta questão anteriormente. Avançando para a próxima.' 
        });
        setTimeout(() => {
          handleNextQuestion();
        }, 2000);
      } else {
        console.error('Falha ao submeter resposta', error);
        alert(error.response?.data?.message || 'Ocorreu um erro ao enviar sua resposta.');
      }
    } finally {
      setIsSubmitting(false);
  } };


  if (isLoading) return <div className="flex justify-center items-center h-full"><p>Carregando questões...</p></div>;
  if (!questions || questions.length === 0) return <div className="flex justify-center items-center h-full"><p>Nenhuma questão encontrada para este bloco.</p></div>;

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = feedback !== null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <StudyHeader
        current={currentQuestionIndex + 1}
        total={questions.length}
      />
      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onAnswerChange={setSelectedAnswer}
        isAnswered={isAnswered}
      />
      {feedback && <FeedbackAlert feedback={feedback} />}
      <StudyControls
        isAnswered={isAnswered}
        isSubmitting={isSubmitting}
        isAnswerSelected={selectedAnswer !== null}
        onSubmit={handleSubmit}
        onNext={handleNextQuestion}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
      />
    </div>
); }