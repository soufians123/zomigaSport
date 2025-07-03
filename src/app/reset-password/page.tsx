"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
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
import { AlertCircle, CheckCircle } from "lucide-react";
import { getUsers, getUserPasswords, saveUserPasswords } from "@/lib/users-service";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!email) {
      setError("رابط غير صالح أو منتهي الصلاحية.");
    }
  }, [email]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      return;
    }
    
    if (password.length < 6) {
      setError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        setError("المستخدم غير موجود. الرابط قد يكون غير صالح.");
        return;
    }

    const passwords = getUserPasswords();
    passwords[user.id] = password;
    saveUserPasswords(passwords);

    setSuccess("تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.");

    setTimeout(() => {
        router.push('/login');
    }, 3000);
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
        <CardDescription>
          أدخل كلمة المرور الجديدة الخاصة بك.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>خطأ</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
             <Alert variant="default" className="border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>نجاح</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="password">كلمة المرور الجديدة</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!!success}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!!success}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!email || !!success}>
            إعادة تعيين كلمة المرور
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                <Suspense fallback={<div>جار التحميل...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
