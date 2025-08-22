'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Book, User, LogOut, Settings, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/study-blocks", icon: Book, label: "Blocos de Estudo" },
  { href: "/profile", icon: User, label: "Meu Perfil" },
  { href: "/admin/questions", icon: Settings, label: "Admin" },
];

export function SidebarContent() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/auth');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
          <Activity className="h-6 w-6 text-primary" />
          <span>Nimes</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
      <div className="mt-auto border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
); }

function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

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