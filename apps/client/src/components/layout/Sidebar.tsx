'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Book, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarContent() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/auth');
  };

  const NAV_ITEMS = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/study-blocks", icon: Book, label: "Blocos de Estudo" },
    { href: "/profile", icon: User, label: "Meu Perfil" },
    { href: "/admin/questions", icon: Settings, label: "Admin" },
  ];

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Book className="h-6 w-6 text-primary" />
          <span>Nimes</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
); }

function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
); }

export function Sidebar() {
  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <SidebarContent />
    </aside>
); }