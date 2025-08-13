'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const registerSchema = z.object({
  name: z.string().min(3, { message: 'O nome precisa ter no mínimo 3 caracteres.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(6, { message: 'A senha precisa ter no mínimo 6 caracteres.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError(null);
    try {
      await api.post('/auth/register', data);
      onSwitch();
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Erro ao criar conta.');
  } };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Crie sua conta</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <button type="button" onClick={onSwitch} className="font-medium text-primary underline-offset-4 hover:underline">
            Faça login
          </button>
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="reg-name">Nome Completo</Label>
          <Input id="reg-name" placeholder="Seu nome" {...register('name')} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reg-email">E-mail</Label>
          <Input id="reg-email" type="email" placeholder="email@exemplo.com" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reg-password">Senha</Label>
          <Input id="reg-password" type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        {apiError && <p className="text-sm font-medium text-destructive">{apiError}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar conta'}
        </Button>
      </form>
    </div>
); }