'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="relative flex-1">
      <Button
        variant="ghost"
        className={cn(
          "flex h-auto flex-col gap-1 rounded-lg p-2 transition-all duration-300 active:scale-95 w-full",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Icon
          size={24}
          strokeWidth={isActive ? 2.5 : 2}
          className={cn("transition-all", isActive ? "scale-110" : "scale-100")}
        />
        <span className="text-xs font-semibold">{label}</span>
      </Button>
    </Link>
); }

export function Footer() {
  const NAV_ITEMS = [
    { href: "/dashboard", label: "Início", icon: Home },
    { href: "/study-blocks", label: "Estudar", icon: BookOpen },
    { href: "/profile", label: "Perfil", icon: User },
    { href: "/admin/questions", label: "Admin", icon: Settings },
  ];

  return (
    <footer className="md:hidden fixed bottom-0 z-50 w-full border-t border-border/50 bg-background shadow-t-md">
      <nav className="flex h-[65px] items-center justify-around px-2">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>
    </footer>
); }