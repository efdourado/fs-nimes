'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);
    try {
      const response = await axios.post('http://localhost:3000/auth/login', data);
      
      localStorage.setItem('accessToken', response.data.accessToken);

      router.push('/dashboard');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
  } };

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Acesse sua conta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
            Crie uma agora
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="email@exemplo.com" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        {apiError && <p className="text-sm font-medium text-destructive">{apiError}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
); }