'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from "@/components/layout/Footer";
import { AppHeader } from "@/components/layout/AppHeader";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/auth');
    } else {
      setIsVerified(true);
    }
  }, [router]);

  if (!isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verificando autenticação...</p>
      </div>
  ); }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 pb-24 md:gap-8 md:p-6 md:pb-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
); }