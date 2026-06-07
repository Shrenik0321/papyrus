"use client";

import { UserForm } from "@/components/forms/user-form";
import { PageLoader } from "@/components/loader";
import { useRequireAdmin } from "@/modules/users/hooks/useRequireAdmin";

export default function CreateUserPage() {
  const { isPending, isAdmin: canManage } = useRequireAdmin();

  if (isPending || !canManage) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
        <p className="text-muted-foreground">
          Enter the basic information for the new user.
        </p>
      </div>

      <UserForm />
    </div>
  );
}
