"use client";

import { useState, useEffect } from "react";
import { SocialLinks } from "@/components/social-links";
import { getThemeSettings } from "@/lib/theme-service";
import { initialThemeSettings } from "@/lib/theme-service";
import type { ThemeSettings } from "@/types";
import { cn } from "@/lib/utils";


export function Footer() {
    const [year, setYear] = useState<number | null>(null);
    const [settings, setSettings] = useState<ThemeSettings>(initialThemeSettings);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const loadSettings = () => {
            setSettings(getThemeSettings());
        }
        loadSettings();
        setYear(new Date().getFullYear());
        setIsMounted(true);
    
        window.addEventListener('theme-changed', loadSettings);
        return () => {
            window.removeEventListener('theme-changed', loadSettings);
        }
    }, []);

    return (
        <footer className={cn("text-center p-4 text-muted-foreground", isMounted ? settings.footerFontSize : 'text-sm')}>
            <SocialLinks />
            {year && <p className="mt-4">© {year} {isMounted ? settings.siteTitle : "Zomigasports"}. جميع الحقوق محفوظة.</p>}
        </footer>
    );
}
