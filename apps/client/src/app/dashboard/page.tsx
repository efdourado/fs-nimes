'use client'; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (!storedToken) {
      router.push('/login');
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  if (!token) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Verificando autenticação...</p>
        </div>
  ); }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Bem-vindo ao Dashboard!</h1>
      <p>Autenticação realizada com sucesso.</p>
      
      <Link href="/study-blocks" legacyBehavior>
        <a className="mt-4 rounded-md bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-500">
          Começar a Estudar
        </a>
      </Link>

      <button 
        onClick={handleLogout}
        className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
      >
        Sair
      </button>
    </div>
); }