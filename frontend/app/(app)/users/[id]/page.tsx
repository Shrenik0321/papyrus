"use client";

import Link from "next/link";
import { UserForm } from "@/components/forms/user-form";
import { PageLoader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useRequireAdmin } from "@/modules/users/hooks/useRequireAdmin";
import { useUser } from "@/modules/users/hooks/useUser";
import { useParams } from "next/navigation";

export default function EditUserPage() {
  const params = useParams();
  const userId = typeof params.id === "string" ? params.id : "";
  const { isPending: isAuthPending, isAdmin: canManage } = useRequireAdmin();
  const { data: user, isLoading, isError, error } = useUser(userId);

  if (isAuthPending || !canManage || isLoading) {
    return <PageLoader />;
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        <p className="text-destructive">
          {error instanceof Error ? error.message : "User not found."}
        </p>
        <Button variant="outline" asChild>
          <Link href="/users">Back to users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground">
          Update the basic information for this user.
        </p>
      </div>

      <UserForm
        userId={user.id}
        initialData={{ name: user.name, email: user.email }}
      />
    </div>
  );
}
