'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, User, LogOut, Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} legacyBehavior>
      <a className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800",
        isActive && "bg-slate-100 dark:bg-slate-800"
      )}>
        <Icon className="h-4 w-4" />
        {label}
      </a>
    </Link>
); }

export function Sidebar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <div className="hidden border-r bg-slate-100/40 dark:bg-slate-800/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-6 w-6" />
            <span>PrevEstudos</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <NavItem href="/dashboard" icon={Home} label="Dashboard" />
            <NavItem href="/study-blocks" icon={BookOpen} label="Blocos de Estudo" />
            <NavItem href="/profile" icon={User} label="Meu Perfil" />
            <NavItem href="/admin/questions" icon={Settings} label="Admin" /> 
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex mt-2 w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
        </div>
      </div>
    </div>
); }