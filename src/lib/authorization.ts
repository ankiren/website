import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { auth } from "@/lib/auth";

/**
 * Check if user has a specific permission
 */
export function hasPermission(permissions: string[] | undefined, required: string): boolean {
  return permissions?.includes(required) ?? false;
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(
  permissions: string[] | undefined,
  required: string[]
): boolean {
  if (!permissions) return false;
  return required.some((p) => permissions.includes(p));
}

/**
 * Check if user has all of the required permissions
 */
export function hasAllPermissions(
  permissions: string[],
  required: string[]
): boolean {
  return required.every((p) => permissions.includes(p));
}

/**
 * Check if user has a specific role
 */
export function hasRole(roles: string[] | undefined, required: string): boolean {
  return roles?.includes(required) ?? false;
}

/**
 * Check if user is admin (has admin role)
 */
export function isAdmin(roles: string[] | undefined): boolean {
  return roles?.includes("admin") ?? false;
}

/**
 * Check permission for current session (async)
 */
export async function checkPermission(permission: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;

  // Admin role has all permissions
  if (isAdmin(session.user.roles)) return true;

  return hasPermission(session.user.permissions, permission);
}

/**
 * Require permission (throws if not authorized)
 */
export async function requirePermission(permission: string): Promise<void> {
  const hasAccess = await checkPermission(permission);
  if (!hasAccess) {
    throw new Error("Forbidden");
  }
}

// Type for API route handler
type HandlerWithAuth = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> },
  session: Session & { user: NonNullable<Session["user"]> }
) => Promise<NextResponse>;

/**
 * Wrap API route handler with authentication check
 */
export function withAuth(handler: HandlerWithAuth) {
  return async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ) => {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, context, session as Session & { user: NonNullable<Session["user"]> });
  };
}

/**
 * Wrap API route handler with permission check
 */
export function withPermission(permission: string, handler: HandlerWithAuth) {
  return withAuth(async (request, context, session) => {
    const hasAccess =
      isAdmin(session.user.roles) ||
      hasPermission(session.user.permissions, permission);

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(request, context, session);
  });
}

/**
 * Wrap API route handler with any of multiple permissions check
 */
export function withAnyPermission(
  permissions: string[],
  handler: HandlerWithAuth
) {
  return withAuth(async (request, context, session) => {
    const hasAccess =
      isAdmin(session.user.roles) ||
      hasAnyPermission(session.user.permissions, permissions);

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(request, context, session);
  });
}
