import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdmin, hasAnyPermission } from "@/lib/authorization";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const canAccess =
    isAdmin(session.user.roles) ||
    hasAnyPermission(session.user.permissions, [
      "users:manage",
      "roles:manage",
      "permissions:manage",
    ]);

  if (!canAccess) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
