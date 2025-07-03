"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { getThemeSettings, saveThemeSettings, resetThemeSettings, initialThemeSettings, themePresets } from "@/lib/theme-service";
import type { ThemeSettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// --- Color Conversion Utilities ---

function hslStringToHex(hsl: string): string {
  try {
    const [h, s, l] = hsl.split(' ').map((val, i) => {
      if (i > 0) return parseFloat(val.replace('%', ''));
      return parseFloat(val);
    });

    const sDecimal = s / 100;
    const lDecimal = l / 100;

    const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lDecimal - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { [r, g, b] = [c, x, 0]; }
    else if (h >= 60 && h < 120) { [r, g, b] = [x, c, 0]; }
    else if (h >= 120 && h < 180) { [r, g, b] = [0, c, x]; }
    else if (h >= 180 && h < 240) { [r, g, b] = [0, x, c]; }
    else if (h >= 240 && h < 300) { [r, g, b] = [x, 0, c]; }
    else if (h >= 300 && h < 360) { [r, g, b] = [c, 0, x]; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch (e) {
    return '#ffffff'; // Fallback color
  }
}

function hexToHslString(hex: string): string {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
}

const ColorPicker = ({ name, label, value, onChange }: { name: keyof ThemeSettings, label: string, value: string, onChange: (key: keyof ThemeSettings, value: string) => void }) => (
    <div className="grid gap-2">
      <Label htmlFor={`color-picker-${name}`} className="capitalize">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id={`color-picker-${name}`}
          type="color"
          value={hslStringToHex(value)}
          onChange={(e) => onChange(name, hexToHslString(e.target.value))}
          className="h-10 w-12 p-1 cursor-pointer border-none"
        />
        <Input
          id={`color-text-${name}`}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="font-mono dir-ltr text-left flex-1"
        />
      </div>
    </div>
);


export default function ManageThemePage() {
  const [settings, setSettings] = useState<ThemeSettings>(initialThemeSettings);
  const [isMounted, setIsMounted] = useState(false);
  const [activePreset, setActivePreset] = useState("احترافي");

  useEffect(() => {
    setSettings(getThemeSettings());
    setIsMounted(true);
  }, []);
  
  const applySettings = (newSettings: ThemeSettings) => {
    setSettings(newSettings);
    saveThemeSettings(newSettings);
  };

  const handleSettingChange = (key: keyof ThemeSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    applySettings(newSettings);
  };

  const handleReset = () => {
    const newSettings = resetThemeSettings();
    applySettings(newSettings);
    setActivePreset("احترافي");
  };
  
  const handlePresetChange = (presetName: string) => {
    const presetColors = themePresets[presetName as keyof typeof themePresets];
    if (presetColors) {
        setActivePreset(presetName);
        const newSettings = { ...settings, ...presetColors };
        applySettings(newSettings);
    }
  };

  if (!isMounted) {
    return (
        <div className="grid gap-6">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    );
  }
  
  const colorGroups = {
    "الألوان الأساسية": ["background", "foreground", "primary", "primaryForeground", "accent", "accentForeground"],
    "ألوان المكونات": ["card", "cardForeground", "popover", "popoverForeground", "secondary", "secondaryForeground", "muted", "mutedForeground"],
    "الألوان الوظيفية": ["destructive", "destructiveForeground", "border", "input", "ring"],
  };

  const labelMap: Record<string, string> = {
    background: "الخلفية",
    foreground: "النص الأساسي",
    primary: "اللون الأساسي",
    primaryForeground: "نص اللون الأساسي",
    accent: "اللون المميز",
    accentForeground: "نص اللون المميز",
    card: "خلفية البطاقة",
    cardForeground: "نص البطاقة",
    popover: "خلفية النافذة المنبثقة",
    popoverForeground: "نص النافذة المنبثقة",
    secondary: "اللون الثانوي",
    secondaryForeground: "نص اللون الثانوي",
    muted: "اللون الخافت",
    mutedForeground: "نص اللون الخافت",
    destructive: "لون الحذف/الخطأ",
    destructiveForeground: "نص لون الحذف",
    border: "لون الحدود",
    input: "لون حقل الإدخال",
    ring: "لون حلقة التركيز",
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">تخصيص المظهر</h1>
        <Button onClick={handleReset} variant="outline">
            <RefreshCw className="h-4 w-4" />
            <span>إعادة تعيين</span>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الهوية البصرية</CardTitle>
            <CardDescription>
              تحكم في شعار وعنوان الموقع وأحجام الخطوط المختلفة.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="siteTitle">عنوان الموقع</Label>
                <Input
                  id="siteTitle"
                  value={settings.siteTitle}
                  onChange={(e) => handleSettingChange('siteTitle', e.target.value)}
                />
              </div>
                <div className="grid gap-2">
                <Label htmlFor="logoUrl">رابط الشعار (اختياري)</Label>
                <Input
                  id="logoUrl"
                  value={settings.logoUrl}
                  onChange={(e) => handleSettingChange('logoUrl', e.target.value)}
                  placeholder="https://.../logo.png"
                />
              </div>
              <div className="grid gap-4">
                  <div className="flex justify-between">
                        <Label htmlFor="headerLogoSize">حجم الشعار</Label>
                        <span className="text-sm text-muted-foreground">{settings.headerLogoSize}px</span>
                  </div>
                  <Slider
                      id="headerLogoSize"
                      min={24}
                      max={64}
                      step={1}
                      value={[settings.headerLogoSize]}
                      onValueChange={(value) => handleSettingChange('headerLogoSize', value[0])}
                  />
              </div>
                <div className="grid gap-2">
                  <Label htmlFor="headerTitleSize">حجم عنوان الهيدر</Label>
                  <Select value={settings.headerTitleSize} onValueChange={(value) => handleSettingChange('headerTitleSize', value)}>
                  <SelectTrigger id="headerTitleSize"><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="text-xl">كبير</SelectItem>
                      <SelectItem value="text-2xl">أكبر</SelectItem>
                      <SelectItem value="text-3xl">ضخم</SelectItem>
                  </SelectContent>
                  </Select>
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="headerNavFontSize">حجم خط القائمة</Label>
                  <Select value={settings.headerNavFontSize} onValueChange={(value) => handleSettingChange('headerNavFontSize', value)}>
                  <SelectTrigger id="headerNavFontSize"><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="text-xs">صغير</SelectItem>
                      <SelectItem value="text-sm">متوسط</SelectItem>
                      <SelectItem value="text-base">كبير</SelectItem>
                  </SelectContent>
                  </Select>
              </div>
                <div className="grid gap-2">
                  <Label htmlFor="footerFontSize">حجم خط الفوتر</Label>
                  <Select value={settings.footerFontSize} onValueChange={(value) => handleSettingChange('footerFontSize', value)}>
                  <SelectTrigger id="footerFontSize"><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="text-xs">صغير</SelectItem>
                      <SelectItem value="text-sm">متوسط</SelectItem>
                      <SelectItem value="text-base">كبير</SelectItem>
                  </SelectContent>
                  </Select>
              </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>الألوان</CardTitle>
                <CardDescription>
                  اختر أحد المظاهر الجاهزة، أو تحكم في كل لون على حدة.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 mb-6">
                    <Label htmlFor="theme-preset">إعدادات مسبقة للمظهر</Label>
                    <Select value={activePreset} onValueChange={handlePresetChange}>
                        <SelectTrigger id="theme-preset">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(themePresets).map(presetName => (
                                <SelectItem key={presetName} value={presetName}>{presetName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Accordion type="single" collapsible defaultValue="item-1">
                  {Object.entries(colorGroups).map(([groupTitle, colorKeys], index) => (
                    <AccordionItem key={groupTitle} value={`item-${index + 1}`}>
                      <AccordionTrigger className="text-lg">{groupTitle}</AccordionTrigger>
                      <AccordionContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-4">
                        {(colorKeys as Array<keyof ThemeSettings>).map((key) => (
                           <ColorPicker
                             key={key}
                             name={key}
                             label={labelMap[key] || key}
                             value={settings[key] as string}
                             onChange={handleSettingChange}
                           />
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
            </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>الخطوط</CardTitle>
                <CardDescription>اختر الخطوط المستخدمة في العناوين والنصوص.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                  <div className="grid gap-2">
                  <Label htmlFor="font-headline">خط العناوين</Label>
                    <Select value={settings.fontHeadline} onValueChange={(value) => handleSettingChange('fontHeadline', value)}>
                    <SelectTrigger id="font-headline">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
                      <SelectItem value="Cairo">Cairo</SelectItem>
                      <SelectItem value="Tajawal">Tajawal</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                  <div className="grid gap-2">
                  <Label htmlFor="font-body">خط النصوص</Label>
                  <Select value={settings.fontBody} onValueChange={(value) => handleSettingChange('fontBody', value)}>
                    <SelectTrigger id="font-body">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Cairo">Cairo</SelectItem>
                      <SelectItem value="Tajawal">Tajawal</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                  <CardTitle>المظهر العام</CardTitle>
                  <CardDescription>تحكم في استدارة الحواف والعناصر الأخرى.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                    <div className="grid gap-4">
                      <div className="flex justify-between">
                            <Label htmlFor="radius">استدارة الحواف</Label>
                            <span className="text-sm text-muted-foreground">{settings.radius.toFixed(2)}rem</span>
                      </div>
                      <Slider
                          id="radius"
                          min={0}
                          max={2}
                          step={0.05}
                          value={[settings.radius]}
                          onValueChange={(value) => handleSettingChange('radius', value[0])}
                      />
                    </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
