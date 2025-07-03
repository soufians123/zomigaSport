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
import { getBettingProviders, saveBettingProviders } from "@/lib/betting-service";
import type { BettingProvider } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const providerSchema = z.object({
  name: z.string().min(1, { message: "اسم الموقع مطلوب." }),
  logoUrl: z.string().url({ message: "الرجاء إدخال رابط شعار صحيح." }),
  rating: z.coerce.number().min(0).max(5).nullable(),
  reviewUrl: z.string().min(1, { message: "رابط المراجعة مطلوب." }),
});

export default function ManageBettingPage() {
  const [providers, setProviders] = useState<BettingProvider[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<BettingProvider | null>(null);

  useEffect(() => {
    setProviders(getBettingProviders());
  }, []);

  const form = useForm<z.infer<typeof providerSchema>>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: "",
      logoUrl: "",
      rating: null,
      reviewUrl: "",
    },
  });

  const handleOpenDialog = (provider: BettingProvider | null) => {
    setEditingProvider(provider);
    if (provider) {
      form.reset(provider);
    } else {
      form.reset({
        name: "",
        logoUrl: "https://placehold.co/60x20.png",
        rating: 0,
        reviewUrl: "#",
      });
    }
    setIsDialogOpen(true);
  };

  function onSubmit(values: z.infer<typeof providerSchema>) {
    let updatedProviders: BettingProvider[];
    if (editingProvider) {
      updatedProviders = providers.map((p) =>
        p.id === editingProvider.id ? { ...p, ...values } : p
      );
    } else {
      const newProvider: BettingProvider = {
        id: (providers.length > 0 ? Math.max(...providers.map((p) => p.id)) : 0) + 1,
        ...values,
      };
      updatedProviders = [...providers, newProvider];
    }
    setProviders(updatedProviders);
    saveBettingProviders(updatedProviders);
    setIsDialogOpen(false);
    setEditingProvider(null);
  }

  const handleDelete = (id: number) => {
    const updatedProviders = providers.filter((provider) => provider.id !== id);
    setProviders(updatedProviders);
    saveBettingProviders(updatedProviders);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">إدارة المراهنات</h1>
        <Button onClick={() => handleOpenDialog(null)}>
          <PlusCircle className="h-4 w-4" />
          <span>إضافة موقع</span>
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingProvider ? "تعديل الموقع" : "إضافة موقع جديد"}
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
                    <FormLabel>اسم الموقع</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: 1xBet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط الشعار</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التقييم (0-5)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? null : +e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reviewUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط المراجعة</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {editingProvider ? "حفظ التغييرات" : "إضافة"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الموقع</TableHead>
                <TableHead className="text-right">التقييم</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Image src={provider.logoUrl} alt={provider.name} width={60} height={20} className="object-contain border p-1 rounded-md" data-ai-hint={`${provider.name.toLowerCase()} logo`} />
                        <span>{provider.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{provider.rating ?? 'N/A'}</TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(provider)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">تعديل</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(provider.id)}
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
    </>
  );
}
