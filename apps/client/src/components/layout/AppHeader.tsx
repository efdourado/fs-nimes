'use client';

import { Sun, Moon, Menu, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarContent } from './Sidebar';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Image from 'next/image';

interface UserProfile {
  profileImage: string | null;
}

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await api.get('/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
        } catch (error) {
          console.error("Failed to fetch user for header", error);
    } } };
    
    fetchUser();
  }, []);


  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      
      <div className="flex w-full items-center justify-end gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
          {user?.profileImage ? (
            <Image src={user.profileImage} alt="Avatar" width={32} height={32} className="object-cover" />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>
    </header>
); }