"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'zomigasports_cookie_consent';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // This code runs only on the client
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <Card className="max-w-4xl mx-auto shadow-2xl bg-card/95 backdrop-blur-sm border-border/50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Cookie className="h-8 w-8 sm:h-10 sm:w-10 text-primary flex-shrink-0" />
            <div className="flex-grow text-center sm:text-right">
              <h2 className="text-lg font-semibold text-card-foreground">نحن نستخدم ملفات تعريف الارتباط</h2>
              <p className="text-sm text-muted-foreground mt-1">
                يستخدم هذا الموقع ملفات تعريف الارتباط لتحسين تجربة المستخدم. باستخدام موقعنا، فإنك توافق على جميع ملفات تعريف الارتباط.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0 mt-3 sm:mt-0">
              <Button onClick={handleAccept} size="lg">أوافق</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
