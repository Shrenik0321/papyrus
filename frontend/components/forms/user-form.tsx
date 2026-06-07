"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCreateUser,
  useUpdateUser,
} from "@/modules/users/hooks/useUser";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
});

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;
type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

interface UserFormProps {
  userId?: string;
  initialData?: UpdateUserFormValues;
}

export function UserForm({ userId, initialData }: UserFormProps) {
  const router = useRouter();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isEdit = userId != null;
  const mutation = isEdit ? updateUser : createUser;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: initialData ?? {
      name: "",
      email: "",
      ...(isEdit ? {} : { password: "" }),
    },
  });

  const onSubmit = (data: CreateUserFormValues | UpdateUserFormValues) => {
    if (isEdit) {
      updateUser.mutate(
        { id: userId, input: data },
        { onSuccess: () => router.push("/users") },
      );
    } else {
      const createData = data as CreateUserFormValues;
      createUser.mutate(createData, {
        onSuccess: () => router.push("/users"),
      });
    }
  };

  const disabled = mutation.isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            disabled={disabled}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            disabled={disabled}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        {!isEdit && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              disabled={disabled}
              {...register("password")}
            />
            {"password" in errors && errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        )}
      </div>
      {mutation.isError && (
        <p className="text-sm text-destructive">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Something went wrong."}
        </p>
      )}
      <div className="flex gap-4 justify-end">
        <Button type="submit" disabled={disabled}>
          {disabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update User" : "Create User"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/users")}
          disabled={disabled}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
