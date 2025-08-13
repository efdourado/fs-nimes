'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const profileSchema = z.object({
  name: z.string().min(3, 'O nome é obrigatório.'),
  bio: z.string().max(150, 'A bio deve ter no máximo 150 caracteres.').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface UserProfile {
  name: string;
  email: string;
  bio: string | null;
  profileImage: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const { data } = await axios.get('http://localhost:3000/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        reset(data);
      } catch (error) {
        console.error('Falha ao buscar perfil', error);
      } finally {
        setIsLoading(false);
    } };

    fetchProfile();
  }, [reset]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    const token = localStorage.getItem('accessToken');
    try {
      const updatedUser = await axios.put('http://localhost:3000/users/me', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(updatedUser.data);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Falha ao atualizar o perfil.');
  } };

  if (isLoading) return <p>Carregando perfil...</p>;
  if (!user) return <p>Não foi possível carregar o perfil.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Seu Perfil</h1>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-24 h-24 rounded-full bg-slate-300 flex items-center justify-center">
          <span className="text-sm text-slate-500">Foto</span>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            {...register('bio')}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Fale um pouco sobre você..."
          />
          {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>
    </div>
); }