'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

const OverlayPanel = ({
  className,
  title,
  description,
  buttonText,
  onClick,
}: {
  className?: string;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}) => (
  <div
    className={cn(
      'absolute top-0 flex h-full w-full flex-col items-center justify-center p-8 text-center text-white transition-opacity duration-300 ease-in-out',
      className,
    )}
  >
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="mt-4 text-lg text-slate-300">{description}</p>
    <button
      onClick={onClick}
      className="mt-8 rounded-full border border-white px-6 py-2 text-sm font-semibold uppercase tracking-wider transition-transform hover:scale-105"
    >
      {buttonText}
    </button>
  </div>
);

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="relative h-[600px] w-full max-w-5xl overflow-hidden rounded-xl bg-card shadow-2xl">
      
      {/* Container dos Formulários (fica estático, visibilidade controlada por opacidade e z-index) */}
      
      <div
        className="absolute top-0 left-0 flex h-full w-1/2 items-center justify-center transition-opacity duration-500 ease-in-out"
        style={{
          opacity: isLoginView ? 0 : 1,
          zIndex: isLoginView ? 1 : 2,
        }}
      >
        <RegisterForm onSwitch={() => setIsLoginView(true)} />
      </div>
      <div
        className="absolute top-0 right-0 flex h-full w-1/2 items-center justify-center transition-opacity duration-500 ease-in-out"
        style={{
          opacity: isLoginView ? 1 : 0,
          zIndex: isLoginView ? 2 : 1,
        }}
      >
        <LoginForm onSwitch={() => setIsLoginView(false)} />
      </div>

      <div
        className={cn(
          'absolute top-0 left-1/2 z-10 h-full w-1/2 overflow-hidden transition-transform duration-700 ease-in-out',
          isLoginView ? '-translate-x-full' : 'translate-x-0',
        )}
      >
        <div className="relative h-full w-full bg-slate-900">
          
          {/* Painel visível na tela de LOGIN */}
          
          <OverlayPanel
            title="Olá, Estudante!"
            description="Ainda não tem uma conta? Cadastre-se e comece sua jornada de aprendizado conosco."
            buttonText="Cadastre-se"
            onClick={() => setIsLoginView(false)}
            className={cn('rounded-r-xl', isLoginView ? 'opacity-100' : 'opacity-0')}
          />
          
          {/* Painel visível na tela de CADASTRO */}

          <OverlayPanel
            title="Bem-vindo de Volta!"
            description="Já possui uma conta? Faça login para continuar de onde parou."
            buttonText="Login"
            onClick={() => setIsLoginView(true)}
            className={cn('rounded-l-xl', !isLoginView ? 'opacity-100' : 'opacity-0')}
          />
        </div>
      </div>
    </div>
); }