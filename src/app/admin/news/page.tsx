"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getNews, saveNews } from "@/lib/news-service";
import type { NewsArticle } from "@/types";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";

const newsSchema = z.object({
  title: z.string().min(3, { message: "العنوان مطلوب ويجب أن يكون 3 أحرف على الأقل." }),
  content: z.string().min(10, { message: "المحتوى مطلوب ويجب أن يكون 10 أحرف على الأقل." }),
  imageUrl: z.string().url({ message: "الرجاء إدخال رابط صورة صحيح." }),
});

export default function ManageNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    setArticles(getNews().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const form = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
    },
  });

  const handleOpenDialog = (article: NewsArticle | null) => {
    setEditingArticle(article);
    if (article) {
      form.reset(article);
    } else {
      form.reset({
        title: "",
        content: "",
        imageUrl: "https://placehold.co/600x400.png",
      });
    }
    setIsDialogOpen(true);
  };

  function onSubmit(values: z.infer<typeof newsSchema>) {
    let updatedArticles: NewsArticle[];
    if (editingArticle) {
      updatedArticles = articles.map((a) =>
        a.id === editingArticle.id ? { ...editingArticle, ...values } : a
      );
    } else {
      const newArticle: NewsArticle = {
        id: (articles.length > 0 ? Math.max(...articles.map((a) => a.id)) : 0) + 1,
        createdAt: new Date().toISOString(),
        ...values,
      };
      updatedArticles = [newArticle, ...articles];
    }
    const sorted = updatedArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setArticles(sorted);
    saveNews(sorted);
    setIsDialogOpen(false);
    setEditingArticle(null);
  }

  const handleDelete = (id: number) => {
    const updatedArticles = articles.filter((article) => article.id !== id);
    setArticles(updatedArticles);
    saveNews(updatedArticles);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">إدارة الأخبار</h1>
        <Button onClick={() => handleOpenDialog(null)}>
          <PlusCircle className="h-4 w-4" />
          <span>إضافة خبر</span>
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? "تعديل الخبر" : "إضافة خبر جديد"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Input placeholder="عنوان الخبر..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المحتوى</FormLabel>
                    <FormControl>
                      <Textarea placeholder="اكتب محتوى الخبر هنا..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط الصورة</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {editingArticle ? "حفظ التغييرات" : "نشر الخبر"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right w-[100px]">الصورة</TableHead>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">تاريخ النشر</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <Image src={article.imageUrl} alt={article.title} width={80} height={45} className="object-cover rounded-md" data-ai-hint="sports news" />
                    </TableCell>
                    <TableCell className="font-medium max-w-sm truncate">{article.title}</TableCell>
                    <TableCell>{format(new Date(article.createdAt), "d MMMM yyyy", { locale: ar })}</TableCell>
                    <TableCell className="text-left">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(article)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">تعديل</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(article.id)}
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
          </div>
        </CardContent>
      </Card>
    </>
  );
}
