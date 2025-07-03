"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

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
  DialogDescription,
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
import { getChannels, saveChannels } from "@/lib/channels-service";
import type { Channel } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

const channelSchema = z.object({
  name: z.string().min(1, { message: "اسم القناة مطلوب." }),
  time: z.string().min(1, { message: "الوصف مطلوب." }),
  streamUrl: z.string().url({ message: "الرجاء إدخال رابط بث صحيح." }),
  thumbnailUrl: z
    .string()
    .url({ message: "الرجاء إدخال رابط صورة مصغرة صحيح." }),
});

export default function ManageChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);

  useEffect(() => {
    setChannels(getChannels());
  }, []);

  const form = useForm<z.infer<typeof channelSchema>>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
      time: "بث مباشر",
      streamUrl: "",
      thumbnailUrl: "https://i.postimg.cc/fytTP2cP/bein.png",
    },
  });

  const handleOpenDialog = (channel: Channel | null) => {
    setEditingChannel(channel);
    if (channel) {
      form.reset(channel);
    } else {
      form.reset({
        name: "",
        time: "بث مباشر",
        streamUrl: "",
        thumbnailUrl: "https://i.postimg.cc/fytTP2cP/bein.png",
      });
    }
    setIsDialogOpen(true);
  };

  function onSubmit(values: z.infer<typeof channelSchema>) {
    let updatedChannels: Channel[];
    if (editingChannel) {
      updatedChannels = channels.map((c) =>
        c.id === editingChannel.id ? { ...c, ...values } : c
      );
    } else {
      const newChannel: Channel = {
        id: (channels.length > 0 ? Math.max(0, ...channels.map((c) => c.id)) : 0) + 1,
        ...values,
      };
      updatedChannels = [...channels, newChannel];
    }
    setChannels(updatedChannels);
    saveChannels(updatedChannels);
    setIsDialogOpen(false);
    setEditingChannel(null);
  }

  const handleDelete = (id: number) => {
    const updatedChannels = channels.filter((channel) => channel.id !== id);
    setChannels(updatedChannels);
    saveChannels(updatedChannels);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">إدارة القنوات</h1>
        <Button onClick={() => handleOpenDialog(null)}>
          <PlusCircle className="h-4 w-4" />
          <span>إضافة قناة</span>
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingChannel ? "تعديل القناة" : "إضافة قناة جديدة"}
            </DialogTitle>
            <DialogDescription>
              أدخل تفاصيل القناة هنا. انقر على 'حفظ' عند الانتهاء.
            </DialogDescription>
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
                    <FormLabel>اسم القناة</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="مثال: beIN 1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: بث مباشر" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="streamUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط البث</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط الصورة المصغرة</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://i.postimg.cc/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {editingChannel ? "حفظ التغييرات" : "إضافة القناة"}
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
                <TableHead className="text-right">اسم القناة</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel.id}>
                  <TableCell className="font-medium">{channel.name}</TableCell>
                  <TableCell>{channel.time}</TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(channel)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">تعديل</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(channel.id)}
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
