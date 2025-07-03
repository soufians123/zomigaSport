"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { PlusCircle, Edit, Trash2, Shield, Download } from "lucide-react";

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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUsers, saveUsers, getUserPasswords, saveUserPasswords, deleteUser as deleteUserService } from "@/lib/users-service";
import type { User } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";


const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, { message: "الاسم مطلوب ويجب أن يكون 3 أحرف على الأقل." }),
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }),
  phone: z.string().optional(),
  role: z.enum(['admin', 'user'], { required_error: "الدور مطلوب." }),
  password: z.string().optional(),
}).superRefine((data, ctx) => {
    if (!data.id && (!data.password || data.password.length < 6)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['password'],
            message: 'كلمة المرور مطلوبة ويجب أن تكون 6 أحرف على الأقل للمستخدم الجديد.',
        });
    }
    if (data.id && data.password && data.password.length > 0 && data.password.length < 6) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['password'],
            message: 'إذا تم إدخال كلمة مرور جديدة، يجب أن تكون 6 أحرف على الأقل.',
        });
    }
});


export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  useEffect(() => {
    setUsers(getUsers().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "user",
      password: "",
    },
  });

  const handleOpenDialog = (user: User | null) => {
    setEditingUser(user);
    if (user) {
      form.reset({ ...user, phone: user.phone ?? '', password: '' });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
      });
    }
    setIsDialogOpen(true);
  };

  function onSubmit(values: z.infer<typeof userSchema>) {
    let updatedUsers: User[];
    const passwords = getUserPasswords();

    if (editingUser) {
      updatedUsers = users.map((u) =>
        u.id === editingUser.id ? { ...u, name: values.name, email: values.email, role: values.role, phone: values.phone } : u
      );
      if (values.password) {
        passwords[editingUser.id] = values.password;
      }
    } else {
      const newId = (users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0) + 1;
      const newUser: User = {
        id: newId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: values.role,
        createdAt: new Date().toISOString(),
      };
      updatedUsers = [newUser, ...users];
      if (values.password) {
        passwords[newId] = values.password;
      }
    }
    
    const sorted = updatedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setUsers(sorted);
    saveUsers(sorted);
    saveUserPasswords(passwords);
    
    setIsDialogOpen(false);
    setEditingUser(null);
  }

  const handleDeleteConfirmation = (id: number) => {
    setDeletingUserId(id);
    setIsDeleteDialogOpen(true);
  }

  const handleDelete = () => {
    if (deletingUserId) {
        deleteUserService(deletingUserId);
        setUsers(getUsers());
        setIsDeleteDialogOpen(false);
        setDeletingUserId(null);
    }
  };

  const handleDownloadCsv = () => {
    if (users.length === 0) {
      alert("لا يوجد مستخدمون لتحميلهم.");
      return;
    }

    const headers = ["id", "name", "email", "phone", "role", "createdAt"];
    
    const escapeCsvValue = (value: string | null | undefined): string => {
      if (value === null || value === undefined) {
        return '""';
      }
      const stringValue = String(value);
      if (/[",\r\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvRows = [
      headers.join(','),
      ...users.map(user => 
        [
          user.id,
          escapeCsvValue(user.name),
          escapeCsvValue(user.email),
          escapeCsvValue(user.phone),
          escapeCsvValue(user.role),
          escapeCsvValue(user.createdAt)
        ].join(',')
      )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'users.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownloadCsv}>
                <Download className="h-4 w-4" />
                <span>تحميل CSV</span>
            </Button>
            <Button onClick={() => handleOpenDialog(null)}>
                <PlusCircle className="h-4 w-4" />
                <span>إضافة مستخدم</span>
            </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
            </DialogTitle>
              <DialogDescription>
              {editingUser ? "اترك حقل كلمة المرور فارغًا لعدم تغييرها." : "املأ النموذج لإنشاء مستخدم جديد."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
                <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <input type="hidden" {...field} />
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الكامل</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: جون دو" {...field} />
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
                      <Input type="email" placeholder="user@example.com" {...field} />
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
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="0512345678" {...field} value={field.value ?? ''} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الدور</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={editingUser?.id === 1}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر دورًا" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">مسؤول</SelectItem>
                        <SelectItem value="user">مستخدم</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {editingUser ? "حفظ التغييرات" : "إضافة مستخدم"}
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
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/40?u=${user.email}`} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            {user.phone && <p className="text-xs text-muted-foreground">{user.phone}</p>}
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role === 'admin' ? 'مسؤول' : 'مستخدم'}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(user.createdAt), "d MMMM yyyy", { locale: ar })}</TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">تعديل</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteConfirmation(user.id)}
                        disabled={user.id === 1}
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
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                  <AlertDialogDescription>
                      هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المستخدم بشكل دائم.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                      نعم، قم بالحذف
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
