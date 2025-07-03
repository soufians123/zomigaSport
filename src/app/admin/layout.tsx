"use client";

import Link from 'next/link';
import { ListVideo, Newspaper, Handshake, Share2, Palette, Users, LayoutDashboard, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "نظرة عامة" },
    { href: "/admin/channels", icon: ListVideo, label: "إدارة القنوات" },
    { href: "/admin/news", icon: Newspaper, label: "إدارة الأخبار" },
    { href: "/admin/betting", icon: Handshake, label: "إدارة المراهنات" },
    { href: "/admin/social", icon: Share2, label: "إدارة التواصل" },
    { href: "/admin/settings", icon: Palette, label: "تخصيص المظهر" },
    { href: "/admin/users", icon: Users, label: "إدارة المستخدمين" },
];

function AdminLayoutContent({ children, pathname }: { children: React.ReactNode; pathname: string }) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
           <h1 className="font-headline font-bold text-lg text-primary px-2">لوحة التحكم</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
              {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href} onClick={handleLinkClick}>
                          <item.icon />
                          <span>{item.label}</span>
                      </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
               <SidebarTrigger className="sm:hidden" />
               <div className="flex-grow" />
               <Button asChild variant="outline">
                  <Link href="/" className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      <span>العودة للموقع</span>
                  </Link>
               </Button>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
          </main>
      </div>
    </>
  );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarProvider>
        <AdminLayoutContent pathname={pathname}>
            {children}
        </AdminLayoutContent>
      </SidebarProvider>
    </div>
  );
}
