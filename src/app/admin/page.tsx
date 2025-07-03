"use client";

import Link from "next/link";
import { ListVideo, Newspaper, Handshake, Share2, Palette, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const dashboardItems = [
    { href: "/admin/channels", icon: ListVideo, label: "إدارة القنوات", description: "إضافة وتعديل وحذف قنوات البث المباشر.", color: "text-red-500" },
    { href: "/admin/news", icon: Newspaper, label: "إدارة الأخبار", description: "كتابة ونشر المقالات والأخبار الرياضية.", color: "text-orange-500" },
    { href: "/admin/betting", icon: Handshake, label: "إدارة المراهنات", description: "التحكم في قائمة مواقع المراهنات الموصى بها.", color: "text-amber-500" },
    { href: "/admin/social", icon: Share2, label: "إدارة التواصل", description: "تحديث روابط وحسابات وسائل التواصل الاجتماعي.", color: "text-green-500" },
    { href: "/admin/settings", icon: Palette, label: "تخصيص المظهر", description: "تغيير ألوان وخطوط وهوية الموقع.", color: "text-sky-500" },
    { href: "/admin/users", icon: Users, label: "إدارة المستخدمين", description: "إدارة حسابات المستخدمين وصلاحياتهم.", color: "text-indigo-500" },
];


export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
        <div className="text-right">
            <h1 className="text-3xl font-headline font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground mt-2 text-base">مرحباً بك! من هنا يمكنك إدارة كل جوانب موقع Zomigasports.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {dashboardItems.map((item) => (
              <Link href={item.href} key={item.href} className="group">
                <Card className="h-full hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col bg-card/80 backdrop-blur-sm">
                  <CardHeader className="p-4">
                    <item.icon className={`h-8 w-8 mb-2 ${item.color}`} />
                    <CardTitle className="text-lg font-headline">{item.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-4 pt-0">
                    <CardDescription className="text-sm">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
    </div>
  );
}
