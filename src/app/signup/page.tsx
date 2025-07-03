"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createUser } from "@/lib/users-service";

const signupSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب ويجب أن يكون 3 أحرف على الأقل." }),
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }),
  phone: z.string().optional(),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
});

export default function SignupPage() {
  const router = useRouter();
  const [formStatus, setFormStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setFormStatus(null);
    const result = createUser({
      name: values.name,
      email: values.email,
      password_input: values.password,
      phone: values.phone,
    });

    if (result.success) {
      setFormStatus({ type: 'success', message: "تم إنشاء الحساب بنجاح! يتم الآن توجيهك لتسجيل الدخول." });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setFormStatus({ type: 'error', message: result.error || "حدث خطأ غير متوقع." });
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">إنشاء حساب</CardTitle>
            <CardDescription>
              أدخل معلوماتك لإنشاء حساب جديد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                {formStatus && (
                  <Alert variant={formStatus.type === 'error' ? 'destructive' : 'default'} className={formStatus.type === 'success' ? "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500" : ''}>
                    {formStatus.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{formStatus.type === 'success' ? 'نجاح' : 'خطأ'}</AlertTitle>
                    <AlertDescription>{formStatus.message}</AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: جون دو" {...field} disabled={formStatus?.type === 'success'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="user@example.com" {...field} disabled={formStatus?.type === 'success'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف (اختياري)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="0512345678" {...field} disabled={formStatus?.type === 'success'}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={formStatus?.type === 'success'}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || formStatus?.type === 'success'}>
                  إنشاء حساب
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              هل لديك حساب بالفعل؟{" "}
              <Link href="/login" className="underline">
                تسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
