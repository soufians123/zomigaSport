"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { getUsers } from "@/lib/users-service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    const users = getUsers();
    const userExists = users.some(user => user.email === email && user.role === 'admin');

    // For security, we show a generic message whether the user exists or not.
    // In a real app, you would trigger an email here if the user exists.
    setMessage("إذا كان هذا البريد الإلكتروني مسجلاً، فستتلقى رابطًا لإعادة تعيين كلمة المرور قريبًا.");
    
    // For this prototype, if the user exists, we'll redirect them to the reset page
    // to simulate clicking a link in an email.
    if (userExists) {
        setTimeout(() => {
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">نسيت كلمة المرور</CardTitle>
            <CardDescription>
              أدخل بريدك الإلكتروني أدناه وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {message && (
                <Alert variant="default" className="border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>تم الإرسال</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!message}
                />
              </div>
              <Button type="submit" className="w-full" disabled={!!message}>
                إرسال رابط إعادة التعيين
              </Button>
               <Button variant="link" asChild>
                <Link href="/login">العودة لتسجيل الدخول</Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
