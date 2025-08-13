'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="container relative h-[600px] w-full max-w-5xl items-center justify-center rounded-xl md:grid lg:grid-cols-2 lg:px-0">
      {/* Container da Animação */}
      <div className={cn(
        "relative h-full flex-col p-8 text-white lg:flex transition-all duration-500 ease-in-out",
        isLoginView ? 'col-span-1' : 'col-span-0 opacity-0 w-0 p-0', // Esconde/Mostra
      )}>
        <div className="absolute inset-0 bg-slate-900 rounded-l-xl" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <BookOpen className="mr-2 h-6 w-6" />
          PrevEstudos
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Esta plataforma transformou minha maneira de estudar. O sistema de progressão me manteve motivado e os simulados foram cruciais para minha aprovação."
            </p>
            <footer className="text-sm">Sofia Mendes</footer>
          </blockquote>
        </div>
      </div>
      
      {/* Container dos Formulários */}
      <div className="relative h-full flex items-center justify-center transition-all duration-500 ease-in-out">
          <div className={cn(
            "transition-opacity duration-300 w-full",
            isLoginView ? 'opacity-100 z-10' : 'opacity-0 z-0 absolute'
          )}>
            <LoginForm onSwitch={toggleView} />
          </div>
          <div className={cn(
            "transition-opacity duration-300 w-full",
            !isLoginView ? 'opacity-100 z-10' : 'opacity-0 z-0 absolute'
          )}>
            <RegisterForm onSwitch={toggleView} />
          </div>
      </div>
    </div>
); }