'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

const questionSchema = z.object({
  blockId: z.string().min(1, 'Bloco é obrigatório.'),
  statement: z.string().min(10, 'O enunciado é muito curto.'),
  explanation: z.string().min(10, 'A explicação é muito curta.'),
  type: z.enum(['CERTO_ERRADO', 'MULTIPLA_ESCOLHA']),
  difficulty: z.enum(['FACIL', 'MEDIO', 'DIFICIL']),
  isCorrect: z.boolean().optional(),
  options: z
    .object({
      options: z
        .array(z.object({ value: z.string().min(1, 'Opção não pode ser vazia.') }))
        .min(2, 'São necessárias pelo menos 2 opções.'),
      answer: z.string().min(1, 'É necessário definir a resposta correta.'),
    })
    .optional(),
})
.refine(data => {
    if (data.type === 'CERTO_ERRADO') return data.isCorrect !== undefined;
    return true;
}, { message: 'Selecione se a afirmativa é Certa ou Errada.', path: ['isCorrect'] })
.refine(data => {
    if (data.type === 'MULTIPLA_ESCOLHA') return !!data.options?.answer;
    return true;
}, { message: 'Selecione uma resposta correta para a múltipla escolha.', path: ['options.answer'] });


type QuestionFormValues = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  blocks: { id: string; title: string }[];
  onSave: (data: QuestionFormValues) => Promise<void>;
  initialData?: Partial<QuestionFormValues>;
}

export function QuestionForm({ blocks, onSave, initialData }: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: initialData || {
      type: 'CERTO_ERRADO',
      difficulty: 'FACIL',
      options: { options: [{ value: '' }, { value: '' }], answer: '' },
  }, });

  const questionType = watch('type');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options.options',
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="blockId">Bloco de Estudo</Label>
          <select id="blockId" {...register('blockId')} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
            <option value="">Selecione um bloco</option>
            {blocks.map(block => <option key={block.id} value={block.id}>{block.title}</option>)}
          </select>
          {errors.blockId && <p className="text-xs text-destructive mt-1">{errors.blockId.message}</p>}
        </div>
        <div>
          <Label htmlFor="type">Tipo de Questão</Label>
          <select id="type" {...register('type')} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
            <option value="CERTO_ERRADO">Certo ou Errado</option>
            <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
          </select>
        </div>
        <div>
          <Label htmlFor="difficulty">Dificuldade</Label>
          <select id="difficulty" {...register('difficulty')} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
            <option value="FACIL">Fácil</option>
            <option value="MEDIO">Médio</option>
            <option value="DIFICIL">Difícil</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="statement">Enunciado da Questão</Label>
        <Textarea id="statement" {...register('statement')} placeholder="Digite o enunciado aqui..." />
        {errors.statement && <p className="text-xs text-destructive mt-1">{errors.statement.message}</p>}
      </div>

      {questionType === 'CERTO_ERRADO' && (
        <div>
          <Label>Resposta Correta</Label>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="isCorrect-true"
                value="true"
                {...register('isCorrect', { setValueAs: (v) => v === 'true' })}
              />
              <Label htmlFor="isCorrect-true">Certo</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="isCorrect-false"
                value="false"
                {...register('isCorrect', { setValueAs: (v) => v === 'false' })}
              />
              <Label htmlFor="isCorrect-false">Errado</Label>
            </div>
          </div>
          {errors.isCorrect && (
            <p className="text-xs text-destructive mt-1">
              {errors.isCorrect.message}
            </p>
          )}
        </div>
      )}

      {questionType === 'MULTIPLA_ESCOLHA' && (
        <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-semibold">Opções e Resposta</h3>
             {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                    <input type="radio" {...register('options.answer')} value={watch(`options.options.${index}.value`)} />
                    <Input {...register(`options.options.${index}.value`)} placeholder={`Opção ${index + 1}`} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="size-4" /></Button>
                </div>
            ))}
             {errors.options?.options && <p className="text-xs text-destructive mt-1">{errors.options.options.message}</p>}
             {errors.options?.answer && <p className="text-xs text-destructive mt-1">{errors.options.answer.message}</p>}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })}>Adicionar Opção</Button>
        </div>
      )}

      <div>
        <Label htmlFor="explanation">Explicação da Resposta</Label>
        <Textarea id="explanation" {...register('explanation')} placeholder="Explique por que a resposta está certa ou errada." />
        {errors.explanation && <p className="text-xs text-destructive mt-1">{errors.explanation.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Questão'}
        </Button>
      </div>
    </form>
); }