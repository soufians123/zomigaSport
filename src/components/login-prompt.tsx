import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

export function LoginPrompt() {
  return (
    <div className="w-full flex items-center justify-center p-4 min-h-[50vh]">
      <Card className="w-full max-w-md text-center bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <PlayCircle className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="mt-4 font-headline text-2xl">المحتوى محمي</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            يجب عليك تسجيل الدخول أو إنشاء حساب جديد لتتمكن من مشاهدة البث المباشر.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full text-lg py-6">
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full text-lg py-6">
            <Link href="/signup">إنشاء حساب جديد</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
