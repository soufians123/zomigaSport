"use client";

import { Menu, LogOut, Home, Newspaper, Handshake, Tv, LayoutDashboard, UserPlus, LogIn, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getThemeSettings, initialThemeSettings } from '@/lib/theme-service';
import { getCurrentUser, logout } from '@/lib/auth-service';
import type { ThemeSettings, User } from '@/types';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from './ui/separator';

const navItems = [
  { href: "/", label: "البث المباشر", icon: Home },
  { href: "/betting", label: "المراهنة", icon: Handshake },
  { href: "/matches", label: "جدول المباريات", icon: Tv },
  { href: "/news", label: "الأخبار", icon: Newspaper },
];

export function Header() {
  const [settings, setSettings] = useState<ThemeSettings>(initialThemeSettings);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadData = () => {
        setSettings(getThemeSettings());
        setCurrentUser(getCurrentUser());
    }
    loadData();
    setIsMounted(true);

    window.addEventListener('theme-changed', loadData);
    window.addEventListener('auth-changed', loadData);
    
    return () => {
        window.removeEventListener('theme-changed', loadData);
        window.removeEventListener('auth-changed', loadData);
    }
  }, []);

  const handleLogout = () => {
      logout();
      setIsSheetOpen(false);
      router.push('/login');
  };

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  }

  const LogoAndTitle = () => {
    if (!isMounted) {
      return (
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-7 w-32" />
        </div>
      );
    }
  
    return (
      <div className="flex items-center gap-2">
        {settings.logoUrl ? (
          <Image 
            src={settings.logoUrl} 
            alt={`${settings.siteTitle} logo`}
            width={settings.headerLogoSize}
            height={settings.headerLogoSize}
            className="object-contain"
          />
        ) : (
          <Shield className="h-8 w-8 text-primary" />
        )}
        <h1 className={cn("font-headline text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", settings.headerTitleSize)}>
          {settings.siteTitle}
        </h1>
      </div>
    );
  };
  
  const desktopNavLinks = (
      <>
        <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">البث المباشر</Link>
        <Link href="/betting" className="text-foreground/80 hover:text-foreground transition-colors">المراهنة</Link>
        <Link href="/matches" className="text-foreground/80 hover:text-foreground transition-colors">جدول المباريات</Link>
        <Link href="/news" className="text-foreground/80 hover:text-foreground transition-colors">الأخبار</Link>
      </>
  );

  const mobileNavLinks = (
    <nav className="flex flex-col gap-1 p-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleLinkClick}
            className={cn(
              "flex items-center gap-4 rounded-lg px-4 py-3 transition-all",
              isActive
                ? "bg-muted text-primary font-semibold shadow-inner"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-base font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Desktop Header */}
        <div className="hidden w-full items-center justify-between md:flex">
             <Link href="/" className="flex items-center gap-3">
              <LogoAndTitle />
            </Link>
            <div className="flex items-center gap-4">
                <nav className={cn("flex items-center gap-6 font-medium", isMounted && settings.headerNavFontSize)}>
                   {desktopNavLinks}
                </nav>
                 <div className="flex items-center gap-4">
                    {!isMounted ? (
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-24" />
                        </div>
                    ) : currentUser ? (
                      <>
                        <span className="text-sm text-muted-foreground hidden lg:inline">مرحباً, {currentUser.name}</span>
                        {currentUser.role === 'admin' && (
                            <Button asChild variant="outline" size="sm">
                                <Link href="/admin">لوحة التحكم</Link>
                            </Button>
                        )}
                        <Button onClick={handleLogout} variant="ghost" size="icon">
                            <LogOut className="h-5 w-5" />
                            <span className="sr-only">تسجيل الخروج</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" asChild>
                            <Link href="/login">تسجيل الدخول</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">إنشاء حساب</Link>
                        </Button>
                      </>
                    )}
                 </div>
            </div>
        </div>

        {/* Mobile Header */}
        <div className="flex w-full items-center justify-between md:hidden">
            <Link href="/" onClick={handleLinkClick} className="flex items-center gap-3">
              <LogoAndTitle />
            </Link>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                        <Menu className="h-8 w-8" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] flex flex-col p-4">
                     <SheetHeader className="border-b pb-4 mb-2">
                        <SheetTitle>
                          <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2">
                                <LogoAndTitle />
                          </Link>
                        </SheetTitle>
                        <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                    </SheetHeader>
                    <div className="flex-grow">
                        {mobileNavLinks}
                    </div>
                    <Separator />
                    <div className="mt-2 p-2">
                       {!isMounted ? (
                            <div className="space-y-2">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                       ) : currentUser ? (
                        <div className="space-y-1">
                             <p className="text-center text-xs text-muted-foreground py-2">مرحباً, {currentUser.name}</p>
                              {currentUser.role === 'admin' && (
                                <Link href="/admin" onClick={handleLinkClick} className="flex items-center gap-4 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground">
                                    <LayoutDashboard className="h-6 w-6" />
                                    <span className="text-base font-semibold">لوحة التحكم</span>
                                </Link>
                            )}
                            <button onClick={handleLogout} className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground">
                                <LogOut className="h-6 w-6" />
                                <span className="text-base font-semibold">تسجيل الخروج</span>
                            </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                             <Link href="/login" onClick={handleLinkClick} className="flex items-center justify-center gap-3 rounded-lg bg-primary px-4 py-3 text-primary-foreground transition-all hover:bg-primary/90">
                                <LogIn className="h-6 w-6" />
                                <span className="text-base font-semibold">تسجيل الدخول</span>
                            </Link>
                            <Link href="/signup" onClick={handleLinkClick} className="flex items-center justify-center gap-3 rounded-lg bg-secondary px-4 py-3 text-secondary-foreground transition-all hover:bg-secondary/80">
                                <UserPlus className="h-6 w-6" />
                                <span className="text-base font-semibold">إنشاء حساب</span>
                            </Link>
                        </div>
                      )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
