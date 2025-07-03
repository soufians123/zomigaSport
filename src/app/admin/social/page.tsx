"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Edit, Trash2, Facebook, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { getSocialLinks, saveSocialLinks } from "@/lib/social-links-service";
import { getSettings, saveSettings } from "@/lib/settings-service";
import type { SocialLink, Settings } from "@/types";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const socialLinkSchema = z.object({
  name: z.enum(["WhatsApp", "Facebook", "Telegram"], { required_error: "اسم الموقع مطلوب." }),
  url: z.string().url({ message: "الرجاء إدخال رابط صحيح." }),
});

const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

const iconMap: Record<SocialLink['name'], React.ReactElement> = {
    WhatsApp: <WhatsAppIcon />,
    Facebook: <Facebook className="h-5 w-5" />,
    Telegram: <Send className="h-5 w-5" />,
};

export default function ManageSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [settings, setSettings] = useState<Settings>({ socialIconSize: 'md' });

  useEffect(() => {
    setLinks(getSocialLinks());
    setSettings(getSettings());
  }, []);

  const form = useForm<z.infer<typeof socialLinkSchema>>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      name: "Facebook",
      url: "",
    },
  });

  const handleOpenDialog = (link: SocialLink | null) => {
    setEditingLink(link);
    if (link) {
      form.reset(link);
    } else {
      form.reset({
        name: "Facebook",
        url: "",
      });
    }
    setIsDialogOpen(true);
  };

  function onSubmit(values: z.infer<typeof socialLinkSchema>) {
    let updatedLinks: SocialLink[];
    if (editingLink) {
      updatedLinks = links.map((l) =>
        l.id === editingLink.id ? { ...l, ...values } : l
      );
    } else {
      const newLink: SocialLink = {
        id: (links.length > 0 ? Math.max(...links.map((p) => p.id)) : 0) + 1,
        ...values,
      };
      updatedLinks = [...links, newLink];
    }
    setLinks(updatedLinks);
    saveSocialLinks(updatedLinks);
    setIsDialogOpen(false);
    setEditingLink(null);
  }

  const handleDelete = (id: number) => {
    const updatedLinks = links.filter((link) => link.id !== id);
    setLinks(updatedLinks);
    saveSocialLinks(updatedLinks);
  };

  const handleSizeChange = (newSize: 'sm' | 'md' | 'lg') => {
    const newSettings = { ...settings, socialIconSize: newSize };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">إدارة التواصل الاجتماعي</h1>
        <Button onClick={() => handleOpenDialog(null)}>
            <PlusCircle className="h-4 w-4" />
            <span>إضافة رابط</span>
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "تعديل الرابط" : "إضافة رابط جديد"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الموقع</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر موقعًا" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Facebook">فيسبوك</SelectItem>
                        <SelectItem value="WhatsApp">واتساب</SelectItem>
                        <SelectItem value="Telegram">تليجرام</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرابط</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {editingLink ? "حفظ التغييرات" : "إضافة"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>إعدادات الأيقونات</CardTitle>
                <CardDescription>التحكم في حجم أيقونات التواصل الاجتماعي المعروضة على الموقع.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <Label htmlFor="icon-size" className="mb-2 block">حجم الأيقونات</Label>
                    <Select onValueChange={handleSizeChange as (value: string) => void} value={settings.socialIconSize}>
                        <SelectTrigger id="icon-size" className="w-[180px]">
                            <SelectValue placeholder="اختر حجمًا" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sm">صغير</SelectItem>
                            <SelectItem value="md">متوسط</SelectItem>
                            <SelectItem value="lg">كبير</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>روابط التواصل الاجتماعي</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الموقع</TableHead>
                  <TableHead className="text-right">الرابط</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {iconMap[link.name]}
                        <span>{link.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{link.url}</a>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(link)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">تعديل</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(link.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">حذف</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
