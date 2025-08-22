'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';

import { api } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User as UserIcon } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(3, 'O nome é obrigatório.'),
  bio: z.string().max(150, 'A bio deve ter no máximo 150 caracteres.').optional(),
  profileImage: z.string().url('URL inválida.').optional().or(z.literal('')),
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
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const { data } = await api.get('/users/me', {
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
      const updatedUser = await api.put('/users/me', { name: data.name, bio: data.bio }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (data.profileImage && data.profileImage !== user?.profileImage) {
        await api.put('/users/me/avatar', { profileImage: data.profileImage }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setUser({ ...updatedUser.data, profileImage: data.profileImage || updatedUser.data.profileImage });
      reset({ ...updatedUser.data, profileImage: data.profileImage || updatedUser.data.profileImage });
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Falha ao atualizar o perfil.');
  } };

  if (isLoading) return <p>Carregando perfil...</p>;
  if (!user) return <p>Não foi possível carregar o perfil.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Seu Perfil</h1>
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {user.profileImage ? (
            <Image src={user.profileImage} alt="Foto de perfil" layout="fill" objectFit="cover" />
          ) : (
            <UserIcon className="w-12 h-12 text-muted-foreground" />
          )}
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
          <Label htmlFor="profileImage">URL da Foto de Perfil</Label>
          <Input id="profileImage" {...register('profileImage')} placeholder="https://exemplo.com/sua-foto.jpg" />
          {errors.profileImage && <p className="text-xs text-destructive">{errors.profileImage.message}</p>}
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
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>
    </div>
); }